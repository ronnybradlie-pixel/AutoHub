from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import User
from .serializer import UserSerializer, RegisterSerializer
from carsapp.models import Car
from bookingapp.models import RentalBooking, Purchase
from companyapp.models import CompanyRegistrationRequest


class UserViewSet(viewsets.ModelViewSet):
    """
    User registration, authentication, and profile management.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'register':
            permission_classes = [AllowAny]
        elif self.action == 'login':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Register a new user"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    'message': 'User registered successfully',
                    'user': UserSerializer(user).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Authenticate user and return token"""
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.check_password(password):
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get or create token
        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                'token': token.key,
                'user': UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logout user by deleting token"""
        request.user.auth_token.delete()
        return Response(
            {'message': 'Logout successful'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user profile"""
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message': 'Profile updated successfully',
                    'user': serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard based on user role"""
        user = request.user
        
        if user.role == 'SUPER_ADMIN':
            return Response(self._get_superadmin_dashboard(user))
        elif user.role == 'DEALERSHIP_ADMIN':
            return Response(self._get_dealership_admin_dashboard(user))
        else:
            return Response(self._get_user_dashboard(user))

    def _get_superadmin_dashboard(self, user):
        """Dashboard for superadmin"""
        pending_registrations = CompanyRegistrationRequest.objects.filter(status='PENDING').count()
        total_companies = CompanyRegistrationRequest.objects.filter(status='APPROVED').count()
        total_users = User.objects.filter(role='USER').count()
        total_dealership_admins = User.objects.filter(role='DEALERSHIP_ADMIN').count()
        total_cars = Car.objects.count()
        
        return {
            'role': 'SUPER_ADMIN',
            'stats': {
                'pending_company_registrations': pending_registrations,
                'approved_companies': total_companies,
                'total_users': total_users,
                'total_dealership_admins': total_dealership_admins,
                'total_cars': total_cars,
                'cars_available_for_sale': Car.objects.filter(status='APPROVED', is_for_sale=True).count(),
                'cars_available_for_rent': Car.objects.filter(status='APPROVED', is_for_rent=True).count(),
            }
        }

    def _get_dealership_admin_dashboard(self, user):
        """Dashboard for dealership admin"""
        dealership = user.dealership
        
        if not dealership:
            return {'error': 'No dealership associated with this admin'}

        total_cars = Car.objects.filter(dealership=dealership).count()
        pending_approvals = Car.objects.filter(dealership=dealership, status='PENDING').count()
        approved_cars = Car.objects.filter(dealership=dealership, status='APPROVED').count()
        company_owned_cars = Car.objects.filter(dealership=dealership, is_company_owned=True).count()
        
        pending_rentals = RentalBooking.objects.filter(car__dealership=dealership, status='PENDING').count()
        active_rentals = RentalBooking.objects.filter(car__dealership=dealership, status='ACTIVE').count()
        
        total_sales = Purchase.objects.filter(car__dealership=dealership, payment_status='PAID').count()
        total_revenue = sum([p.price_at_purchase for p in Purchase.objects.filter(car__dealership=dealership, payment_status='PAID')])

        return {
            'role': 'DEALERSHIP_ADMIN',
            'dealership': {
                'id': dealership.id,
                'name': dealership.name,
                'city': dealership.city,
                'email': dealership.email,
                'phone': dealership.phone
            },
            'stats': {
                'total_cars': total_cars,
                'pending_approvals': pending_approvals,
                'approved_cars': approved_cars,
                'company_owned_cars': company_owned_cars,
                'pending_rentals': pending_rentals,
                'active_rentals': active_rentals,
                'total_sales': total_sales,
                'total_revenue': str(total_revenue),
                'cars_for_sale': Car.objects.filter(dealership=dealership, is_for_sale=True, status='APPROVED').count(),
                'cars_for_rent': Car.objects.filter(dealership=dealership, is_for_rent=True, status='APPROVED').count(),
            }
        }

    def _get_user_dashboard(self, user):
        """Dashboard for regular user"""
        submitted_cars = Car.objects.filter(seller=user).count()
        approved_cars = Car.objects.filter(seller=user, status='APPROVED').count()
        pending_cars = Car.objects.filter(seller=user, status='PENDING').count()
        rejected_cars = Car.objects.filter(seller=user, status='REJECTED').count()
        
        rental_bookings = RentalBooking.objects.filter(user=user).count()
        active_rentals = RentalBooking.objects.filter(user=user, status='ACTIVE').count()
        completed_rentals = RentalBooking.objects.filter(user=user, status='COMPLETED').count()
        
        purchases = Purchase.objects.filter(buyer=user).count()
        paid_purchases = Purchase.objects.filter(buyer=user, payment_status='PAID').count()

        return {
            'role': 'USER',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'phone_number': user.phone_number,
                'is_verified': user.is_verified
            },
            'stats': {
                'submitted_cars': submitted_cars,
                'approved_cars': approved_cars,
                'pending_cars': pending_cars,
                'rejected_cars': rejected_cars,
                'rental_bookings': rental_bookings,
                'active_rentals': active_rentals,
                'completed_rentals': completed_rentals,
                'purchases': purchases,
                'paid_purchases': paid_purchases
            },
            'recent_activity': {
                'latest_submission': Car.objects.filter(seller=user).values('id', 'brand', 'model', 'status').first(),
                'latest_booking': RentalBooking.objects.filter(user=user).values('id', 'car_id', 'status').first() if RentalBooking.objects.filter(user=user).exists() else None,
                'latest_purchase': Purchase.objects.filter(buyer=user).values('id', 'car_id', 'payment_status').first() if Purchase.objects.filter(buyer=user).exists() else None,
            }
        }

    @action(detail=False, methods=['put', 'patch'])
    def change_password(self, request):
        """Change user password"""
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not all([old_password, new_password]):
            return Response(
                {'error': 'old_password and new_password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):
            return Response(
                {'error': 'Old password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {'message': 'Password changed successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def promote_to_dealership_admin(self, request, pk=None):
        """Promote user to dealership admin - Only for superadmin"""
        if request.user.role != 'SUPER_ADMIN':
            return Response(
                {'error': 'Only superadmin can promote users'},
                status=status.HTTP_403_FORBIDDEN
            )

        user_to_promote = self.get_object()
        dealership_id = request.data.get('dealership_id')

        if not dealership_id:
            return Response(
                {'error': 'dealership_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from companyapp.models import DealershipCompany
            dealership = DealershipCompany.objects.get(id=dealership_id)
        except:
            return Response(
                {'error': 'Dealership not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        user_to_promote.role = 'DEALERSHIP_ADMIN'
        user_to_promote.dealership = dealership
        user_to_promote.save()

        return Response(
            {
                'message': f'User promoted to dealership admin for {dealership.name}',
                'user': UserSerializer(user_to_promote).data
            },
            status=status.HTTP_200_OK
        )

