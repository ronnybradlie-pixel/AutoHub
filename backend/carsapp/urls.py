from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')
router.register(r'images', CarImageViewSet, basename='carimage')
router.register(r'inspections', CarInspectionViewSet, basename='carinspection')

urlpatterns = [
    path('', include(router.urls)),
]
