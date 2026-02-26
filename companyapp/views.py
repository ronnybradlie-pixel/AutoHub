from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import CompanyRegistrationRequest, DealershipCompany
from .serializer import CompanyRegistrationRequestSerializer, DealershipCompanySerializer
from autoapp.models import User


class CompanyRegistrationViewSet(viewsets.ModelViewSet):
    """
    Handles company registration requests.
    Any user can submit a registration request.
    Only superadmin can approve or reject requests.
    """
    queryset = CompanyRegistrationRequest.objects.all()
    serializer_class = CompanyRegistrationRequestSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['company_name', 'company_email', 'company_license_number']
    ordering_fields = ['submitted_at', 'status']
    ordering = ['-submitted_at']

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """Create a new company registration request"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'message': 'Company registration request submitted successfully'},
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def pending_requests(self, request):
        """Get all pending company registration requests - Only for superadmin"""
        if request.user.role != 'SUPER_ADMIN':
            return Response(
                {'error': 'Only superadmin can view pending requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        pending = CompanyRegistrationRequest.objects.filter(status='PENDING')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """Approve a company registration request - Only for superadmin"""
        if request.user.role != 'SUPER_ADMIN':
            return Response(
                {'error': 'Only superadmin can approve company registrations'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        registration_request = self.get_object()
        
        if registration_request.status != 'PENDING':
            return Response(
                {'error': f'Cannot approve a {registration_request.status.lower()} request'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create dealership company from registration request
        dealership = DealershipCompany.objects.create(
            name=registration_request.company_name,
            email=registration_request.company_email,
            phone=registration_request.company_phone,
            city=registration_request.company_city,
            license_number=registration_request.company_license_number,
            license_document=registration_request.company_license_document,
            approved_by=request.user,
            approved_at=timezone.now()
        )

        # Update registration request status
        registration_request.status = 'APPROVED'
        registration_request.reviewed_by = request.user
        registration_request.reviewed_at = timezone.now()
        registration_request.save()

        return Response(
            {
                'message': 'Company registration approved successfully',
                'dealership': DealershipCompanySerializer(dealership).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """Reject a company registration request - Only for superadmin"""
        if request.user.role != 'SUPER_ADMIN':
            return Response(
                {'error': 'Only superadmin can reject company registrations'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        registration_request = self.get_object()
        
        if registration_request.status != 'PENDING':
            return Response(
                {'error': f'Cannot reject a {registration_request.status.lower()} request'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', 'No reason provided')
        
        # Update registration request status
        registration_request.status = 'REJECTED'
        registration_request.reviewed_by = request.user
        registration_request.reviewed_at = timezone.now()
        registration_request.save()

        return Response(
            {
                'message': 'Company registration rejected successfully',
                'reason': reason
            },
            status=status.HTTP_200_OK
        )


class DealershipCompanyViewSet(viewsets.ModelViewSet):
    """
    Manages approved dealership companies.
    """
    queryset = DealershipCompany.objects.filter(is_active=True)
    serializer_class = DealershipCompanySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'email']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter based on user role"""
        if self.request.user.role == 'SUPER_ADMIN':
            return DealershipCompany.objects.all()
        elif self.request.user.role == 'DEALERSHIP_ADMIN':
            # Dealership admin can only see their own dealership
            return DealershipCompany.objects.filter(admins=self.request.user)
        else:
            # Regular users can see all active dealerships
            return DealershipCompany.objects.filter(is_active=True)

    @action(detail=False, methods=['get'])
    def my_dealership(self, request):
        """Get the dealership admin's own dealership"""
        if request.user.role != 'DEALERSHIP_ADMIN':
            return Response(
                {'error': 'Only dealership admins can view their dealership'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        dealership = request.user.dealership
        if not dealership:
            return Response(
                {'error': 'No dealership associated with this admin'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(dealership)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def deactivate(self, request, pk=None):
        """Deactivate a dealership - Only for superadmin"""
        if request.user.role != 'SUPER_ADMIN':
            return Response(
                {'error': 'Only superadmin can deactivate dealerships'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        dealership = self.get_object()
        dealership.is_active = False
        dealership.save()
        
        return Response(
            {'message': 'Dealership deactivated successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def get_dealership_details(self, request, pk=None):
        """Get detailed information about a dealership including stats"""
        dealership = self.get_object()
        
        stats = {
            'total_cars': dealership.cars.count(),
            'approved_cars': dealership.cars.filter(status='APPROVED').count(),
            'pending_cars': dealership.cars.filter(status='PENDING').count(),
            'total_admins': dealership.admins.count(),
        }
        
        serializer = self.get_serializer(dealership)
        response_data = serializer.data
        response_data['stats'] = stats
        
        return Response(response_data)
