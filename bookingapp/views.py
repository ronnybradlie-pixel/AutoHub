from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
from .models import RentalBooking, Purchase
from carsapp.models import Car


class RentalBookingViewSet(viewsets.ModelViewSet):
    """
    Handles car rental bookings.
    - Users can create rental requests
    - Dealership admins can approve/reject rentals
    """
    queryset = RentalBooking.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['start_date', 'created_at', 'total_price']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter rentals based on user role"""
        if self.request.user.role == 'SUPER_ADMIN':
            return RentalBooking.objects.all()
        elif self.request.user.role == 'DEALERSHIP_ADMIN':
            # Dealership admin sees rentals for their cars
            return RentalBooking.objects.filter(car__dealership=self.request.user.dealership)
        else:
            # Users see their own rentals
            return RentalBooking.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Create a new rental booking"""
        car_id = request.data.get('car')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        if not all([car_id, start_date, end_date]):
            return Response(
                {'error': 'car, start_date, and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            car = Car.objects.get(id=car_id)
        except Car.DoesNotExist:
            return Response(
                {'error': 'Car not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not car.is_for_rent or car.status != 'APPROVED':
            return Response(
                {'error': 'This car is not available for rent'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use DD-MM-YYYY'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if end_date_obj <= start_date_obj:
            return Response(
                {'error': 'End date must be after start date'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for conflicts with existing bookings
        conflicts = RentalBooking.objects.filter(
            car=car,
            status__in=['APPROVED', 'ACTIVE']
        ).filter(
            Q(start_date_lte=start_date_obj, end_date_gt=start_date_obj) |
            Q(start_date_lt=end_date_obj, end_date_gte=end_date_obj) |
            Q(start_date_gte=start_date_obj, end_date_lte=end_date_obj)
        )

        if conflicts.exists():
            return Response(
                {'error': 'Car is not available for the selected dates'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate total price
        num_days = (end_date_obj - start_date_obj).days
        total_price = num_days * car.rental_price_per_day

        booking = RentalBooking.objects.create(
            car=car,
            user=request.user,
            start_date=start_date_obj,
            end_date=end_date_obj,
            total_price=total_price,
            status='PENDING'
        )

        return Response(
            {
                'id': booking.id,
                'car': car.id,
                'user': request.user.id,
                'start_date': start_date_obj,
                'end_date': end_date_obj,
                'total_price': total_price,
                'status': 'PENDING',
                'message': 'Rental booking created successfully'
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """Get all rentals for the current user"""
        bookings = RentalBooking.objects.filter(user=request.user).order_by('-created_at')
        
        status_filter = request.query_params.get('status')
        if status_filter:
            bookings = bookings.filter(status=status_filter)

        data = []
        for booking in bookings:
            data.append({
                'id': booking.id,
                'car': {
                    'id': booking.car.id,
                    'title': booking.car.title,
                    'brand': booking.car.brand,
                    'model': booking.car.model,
                    'price_per_day': booking.car.rental_price_per_day
                },
                'start_date': booking.start_date,
                'end_date': booking.end_date,
                'total_price': booking.total_price,
                'status': booking.status,
                'created_at': booking.created_at
            })

        return Response(data)

    @action(detail=False, methods=['get'])
    def pending_bookings(self, request):
        """Get pending rental bookings for dealership admin approval"""
        if request.user.role != 'DEALERSHIP_ADMIN':
            return Response(
                {'error': 'Only dealership admins can view pending bookings'},
                status=status.HTTP_403_FORBIDDEN
            )

        pending = RentalBooking.objects.filter(
            car__dealership=request.user.dealership,
            status='PENDING'
        ).order_by('-created_at')

        data = []
        for booking in pending:
            data.append({
                'id': booking.id,
                'user': {
                    'id': booking.user.id,
                    'username': booking.user.username,
                    'email': booking.user.email
                },
                'car': {
                    'id': booking.car.id,
                    'title': booking.car.title,
                    'brand': booking.car.brand,
                    'model': booking.car.model
                },
                'start_date': booking.start_date,
                'end_date': booking.end_date,
                'total_price': booking.total_price,
                'status': booking.status
            })

        return Response(data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a rental booking - Only for dealership admin"""
        booking = self.get_object()

        if request.user.role != 'DEALERSHIP_ADMIN' or booking.car.dealership != request.user.dealership:
            return Response(
                {'error': 'You are not authorized to approve this booking'},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status != 'PENDING':
            return Response(
                {'error': f'Cannot approve a booking with status: {booking.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'APPROVED'
        booking.save()

        return Response(
            {'message': 'Rental booking approved successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a rental booking - Only for dealership admin"""
        booking = self.get_object()

        if request.user.role != 'DEALERSHIP_ADMIN' or booking.car.dealership != request.user.dealership:
            return Response(
                {'error': 'You are not authorized to reject this booking'},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status != 'PENDING':
            return Response(
                {'error': f'Cannot reject a booking with status: {booking.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', 'No reason provided')
        
        booking.status = 'CANCELLED'
        booking.save()

        return Response(
            {
                'message': 'Rental booking rejected',
                'reason': reason
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def start_rental(self, request, pk=None):
        """Start an approved rental - Change status from APPROVED to ACTIVE"""
        booking = self.get_object()

        if request.user.role != 'DEALERSHIP_ADMIN' or booking.car.dealership != request.user.dealership:
            return Response(
                {'error': 'You are not authorized to start this rental'},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status != 'APPROVED':
            return Response(
                {'error': f'Can only start rentals with APPROVED status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'ACTIVE'
        booking.save()

        return Response(
            {'message': 'Rental started successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def complete_rental(self, request, pk=None):
        """Complete an active rental"""
        booking = self.get_object()

        if request.user.role != 'DEALERSHIP_ADMIN' or booking.car.dealership != request.user.dealership:
            return Response(
                {'error': 'You are not authorized to complete this rental'},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status != 'ACTIVE':
            return Response(
                {'error': 'Can only complete rentals with ACTIVE status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'COMPLETED'
        booking.save()

        return Response(
            {'message': 'Rental completed successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a rental booking"""
        booking = self.get_object()

        if booking.user != request.user and request.user.role != 'DEALERSHIP_ADMIN':
            return Response(
                {'error': 'You are not authorized to cancel this booking'},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status not in ['PENDING', 'APPROVED']:
            return Response(
                {'error': 'Can only cancel PENDING or APPROVED bookings'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', 'No reason provided')
        booking.status = 'CANCELLED'
        booking.save()

        return Response(
            {'message': 'Rental booking cancelled'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        """Check car availability for specific dates"""
        car_id = request.query_params.get('car_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not all([car_id, start_date, end_date]):
            return Response(
                {'error': 'car_id, start_date, and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            car = Car.objects.get(id=car_id)
        except Car.DoesNotExist:
            return Response(
                {'error': 'Car not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )

        conflicts = RentalBooking.objects.filter(
            car=car,
            status__in=['APPROVED', 'ACTIVE']
        ).filter(
            Q(start_date_lte=start_date_obj, end_date_gt=start_date_obj) |
            Q(start_date_lt=end_date_obj, end_date_gte=end_date_obj) |
            Q(start_date_gte=start_date_obj, end_date_lte=end_date_obj)
        )

        available = not conflicts.exists()

        return Response({
            'car_id': car_id,
            'start_date': start_date,
            'end_date': end_date,
            'available': available,
            'price_per_day': car.rental_price_per_day
        })


class PurchaseViewSet(viewsets.ModelViewSet):
    """
    Handles car purchases.
    """
    queryset = Purchase.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['purchase_date', 'price_at_purchase']
    ordering = ['-purchase_date']

    def get_queryset(self):
        """Filter purchases based on user role"""
        if self.request.user.role == 'SUPER_ADMIN':
            return Purchase.objects.all()
        elif self.request.user.role == 'DEALERSHIP_ADMIN':
            # Dealership admin sees purchases for their cars
            return Purchase.objects.filter(car__dealership=self.request.user.dealership)
        else:
            # Users see their own purchases
            return Purchase.objects.filter(buyer=self.request.user)

    def create(self, request, *args, **kwargs):
        """Create a new purchase record"""
        car_id = request.data.get('car')

        if not car_id:
            return Response(
                {'error': 'car is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            car = Car.objects.get(id=car_id)
        except Car.DoesNotExist:
            return Response(
                {'error': 'Car not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if car.status == 'SOLD':
            return Response(
                {'error': 'This car is already sold'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not car.is_for_sale or car.status != 'APPROVED':
            return Response(
                {'error': 'This car is not available for purchase'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if car is already purchased
        if hasattr(car, 'purchase') and car.purchase:
            return Response(
                {'error': 'This car is already purchased'},
                status=status.HTTP_400_BAD_REQUEST
            )

        purchase = Purchase.objects.create(
            car=car,
            buyer=request.user,
            price_at_purchase=car.price,
            payment_status='PENDING'
        )

        car.status = 'SOLD'
        car.save()

        return Response(
            {
                'id': purchase.id,
                'car': car.id,
                'buyer': request.user.id,
                'price_at_purchase': purchase.price_at_purchase,
                'payment_status': purchase.payment_status,
                'message': 'Purchase created successfully'
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'])
    def my_purchases(self, request):
        """Get all purchases made by the current user"""
        purchases = Purchase.objects.filter(buyer=request.user).order_by('-purchase_date')

        data = []
        for purchase in purchases:
            data.append({
                'id': purchase.id,
                'car': {
                    'id': purchase.car.id,
                    'title': purchase.car.title,
                    'brand': purchase.car.brand,
                    'model': purchase.car.model,
                    'year': purchase.car.year
                },
                'price_at_purchase': purchase.price_at_purchase,
                'payment_status': purchase.payment_status,
                'purchase_date': purchase.purchase_date
            })

        return Response(data)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark purchase as paid - Only payment processor or admin"""
        purchase = self.get_object()

        if purchase.buyer != request.user and request.user.role != 'DEALERSHIP_ADMIN':
            return Response(
                {'error': 'You are not authorized to update this purchase'},
                status=status.HTTP_403_FORBIDDEN
            )

        if purchase.payment_status == 'PAID':
            return Response(
                {'error': 'This purchase is already paid'},
                status=status.HTTP_400_BAD_REQUEST
            )

        purchase.payment_status = 'PAID'
        purchase.save()

        return Response(
            {'message': 'Payment marked as completed'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def mark_failed(self, request, pk=None):
        """Mark purchase payment as failed"""
        purchase = self.get_object()

        if purchase.buyer != request.user and request.user.role != 'DEALERSHIP_ADMIN':
            return Response(
                {'error': 'You are not authorized to update this purchase'},
                status=status.HTTP_403_FORBIDDEN
            )

        purchase.payment_status = 'FAILED'
        purchase.save()

        # Revert car status to APPROVED
        purchase.car.status = 'APPROVED'
        purchase.car.save()

        return Response(
            {'message': 'Payment marked as failed'},
            status=status.HTTP_200_OK
        )