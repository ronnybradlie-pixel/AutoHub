from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'registrations', CompanyRegistrationViewSet, basename='companyregistration')
router.register(r'dealerships', DealershipCompanyViewSet, basename='dealership')

urlpatterns = [
    path('', include(router.urls)),
]
