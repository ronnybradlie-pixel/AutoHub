from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Q
from .models import Car, CarImage, CarInspection
from .serializer import CarSerializer, CarCreateSerializer, CarImageSerializer, CarInspectionSerializer


class CarViewSet(viewsets.ModelViewSet):
    """
    Handles car listings, creation, and approval.
    - Users can submit cars to dealerships
    - Dealership admins can approve cars
    - Companies can list their own cars
    """
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['brand', 'model', 'title', 'description']
    ordering_fields = ['created_at', 'price', 'year']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter cars based on user role and status"""
        if self.request.user.is_authenticated:
            if self.request.user.role == 'SUPER_ADMIN':
                return Car.objects.all()
            elif self.request.user.role == 'DEALERSHIP_ADMIN':
                # Dealership admin sees cars from their dealership
                return Car.objects.filter(dealership=self.request.user.dealership)
            elif self.request.user.role == 'USER':
                # Regular users only see approved cars and their own submissions
                return Car.objects.filter(Q(status='APPROVED') | Q(seller=self.request.user))
        else:
            # Anonymous users only see approved cars
            return Car.objects.filter(status='APPROVED')

    def get_serializer_class(self):
        if self.action == 'create':
            return CarCreateSerializer
        return CarSerializer

    def create(self, request, *args, **kwargs):
        """Create a new car listing"""
        dealership_id = request.data.get('dealership')
        is_company_owned = request.data.get('is_company_owned', False)

        if not dealership_id:
            return Response(
                {'error': 'Dealership is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not is_company_owned:
            # Regular user submitting car to dealership
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(seller=request.user, status='PENDING')
        else:
            # Check if user is dealership admin
            if request.user.role != 'DEALERSHIP_ADMIN' or request.user.dealership_id != int(dealership_id):
                return Response(
                    {'error': 'Only dealership admin can add company-owned cars'},
                    status=status.HTTP_403_FORBIDDEN
                )
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(is_company_owned=True, status='APPROVED')

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def my_submissions(self, request):
        """Get cars submitted by the current user"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        cars = Car.objects.filter(seller=request.user)
        serializer = self.get_serializer(cars, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available_for_sale(self, request):
        """Get all approved cars available for sale"""
        cars = Car.objects.filter(status='APPROVED', is_for_sale=True)
        
        # Apply filters
        brand = request.query_params.get('brand')
        year_from = request.query_params.get('year_from')
        year_to = request.query_params.get('year_to')
        price_max = request.query_params.get('price_max')
        fuel_type = request.query_params.get('fuel_type')

        if brand:
            cars = cars.filter(brand__icontains=brand)
        if year_from:
            cars = cars.filter(year__gte=year_from)
        if year_to:
            cars = cars.filter(year__lte=year_to)
        if price_max:
            cars = cars.filter(price__lte=price_max)
        if fuel_type:
            cars = cars.filter(fuel_type__icontains=fuel_type)

        serializer = self.get_serializer(cars, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available_for_rent(self, request):
        """Get all approved cars available for rent"""
        cars = Car.objects.filter(status='APPROVED', is_for_rent=True)
        serializer = self.get_serializer(cars, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending_approval(self, request):
        """Get pending cars for dealership admin approval"""
        if request.user.role != 'DEALERSHIP_ADMIN':
            return Response(
                {'error': 'Only dealership admins can view pending cars'},
                status=status.HTTP_403_FORBIDDEN
            )

        pending_cars = Car.objects.filter(
            dealership=request.user.dealership,
            status='PENDING'
        )
        serializer = self.get_serializer(pending_cars, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a car submission - Only for dealership admin"""
        car = self.get_object()

        if request.user.role != 'DEALERSHIP_ADMIN' or car.dealership != request.user.dealership:
            return Response(
                {'error': 'You are not authorized to approve this car'},
                status=status.HTTP_403_FORBIDDEN
            )

        if car.status != 'PENDING':
            return Response(
                {'error': f'Cannot approve a car with status: {car.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        car.status = 'APPROVED'
        car.approved_by = request.user
        car.approved_at = timezone.now()
        car.save()

        return Response(
            {'message': 'Car approved successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a car submission - Only for dealership admin"""
        car = self.get_object()

        if request.user.role != 'DEALERSHIP_ADMIN' or car.dealership != request.user.dealership:
            return Response(
                {'error': 'You are not authorized to reject this car'},
                status=status.HTTP_403_FORBIDDEN
            )

        if car.status != 'PENDING':
            return Response(
                {'error': f'Cannot reject a car with status: {car.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', 'No reason provided')

        car.status = 'REJECTED'
        car.approved_by = request.user
        car.approved_at = timezone.now()
        car.save()

        return Response(
            {
                'message': 'Car rejected successfully',
                'reason': reason
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def mark_sold(self, request, pk=None):
        """Mark a car as sold"""
        car = self.get_object()

        if car.dealership != request.user.dealership and request.user.role not in ['DEALERSHIP_ADMIN', 'SUPER_ADMIN']:
            return Response(
                {'error': 'You are not authorized to update this car'},
                status=status.HTTP_403_FORBIDDEN
            )

        car.status = 'SOLD'
        car.is_for_sale = False
        car.is_for_rent = False
        car.save()

        return Response(
            {'message': 'Car marked as sold'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['put', 'patch'])
    def update_specs(self, request, pk=None):
        """Update car specifications - Only dealership admin can update"""
        car = self.get_object()

        if request.user.role != 'DEALERSHIP_ADMIN' or car.dealership != request.user.dealership:
            return Response(
                {'error': 'Only dealership admin can update this car'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(car, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class CarImageViewSet(viewsets.ModelViewSet):
    """
    Handles car images/photos.
    """
    queryset = CarImage.objects.all()
    serializer_class = CarImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter images based on user"""
        car_id = self.request.query_params.get('car_id')
        if car_id:
            return CarImage.objects.filter(car_id=car_id)
        return CarImage.objects.all()

    def create(self, request, *args, **kwargs):
        """Add image to a car"""
        car_id = request.data.get('car_id')
        
        if not car_id:
            return Response(
                {'error': 'car_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            car = Car.objects.get(id=car_id)
        except Car.DoesNotExist:
            return Response(
                {'error': 'Car not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check permissions
        if car.seller != request.user and (request.user.role != 'DEALERSHIP_ADMIN' or car.dealership != request.user.dealership):
            return Response(
                {'error': 'You are not authorized to add images to this car'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(car=car)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        """Set an image as primary for the car"""
        image = self.get_object()
        car = image.car

        # Check permissions
        if car.seller != request.user and (request.user.role != 'DEALERSHIP_ADMIN' or car.dealership != request.user.dealership):
            return Response(
                {'error': 'You are not authorized to modify this car'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Unset previous primary image
        CarImage.objects.filter(car=car, is_primary=True).update(is_primary=False)
        
        # Set new primary
        image.is_primary = True
        image.save()

        return Response(
            {'message': 'Image set as primary'},
            status=status.HTTP_200_OK
        )


class CarInspectionViewSet(viewsets.ModelViewSet):
    """
    Handles car inspections and condition checks.
    """
    queryset = CarInspection.objects.all()
    serializer_class = CarInspectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter inspections based on user role"""
        if self.request.user.role == 'SUPER_ADMIN':
            return CarInspection.objects.all()
        elif self.request.user.role == 'DEALERSHIP_ADMIN':
            return CarInspection.objects.filter(car__dealership=self.request.user.dealership)
        return CarInspection.objects.filter(car__seller=self.request.user)

    def create(self, request, *args, **kwargs):
        """Create or update car inspection"""
        car_id = request.data.get('car_id')

        if not car_id:
            return Response(
                {'error': 'car_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            car = Car.objects.get(id=car_id)
        except Car.DoesNotExist:
            return Response(
                {'error': 'Car not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Only dealership admin can create inspections
        if request.user.role != 'DEALERSHIP_ADMIN' or car.dealership != request.user.dealership:
            return Response(
                {'error': 'Only dealership admin can create inspections'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if inspection already exists
        inspection, created = CarInspection.objects.get_or_create(car=car)

        serializer = self.get_serializer(inspection, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(inspected_by=request.user, car=car)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def approve_inspection(self, request, pk=None):
        """Approve car inspection"""
        inspection = self.get_object()

        if request.user.role != 'DEALERSHIP_ADMIN' or inspection.car.dealership != request.user.dealership:
            return Response(
                {'error': 'You are not authorized to approve this inspection'},
                status=status.HTTP_403_FORBIDDEN
            )

        inspection.approved = True
        inspection.save()

        return Response(
            {'message': 'Inspection approved'},
            status=status.HTTP_200_OK
        )