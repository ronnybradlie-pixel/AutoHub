from rest_framework import serializers
from .models import RentalBooking, Purchase

class RentalBookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = RentalBooking
        fields = '__all__'
        read_only_fields = ['status', 'created_at']

class PurchaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Purchase
        fields = '__all__'
        read_only_fields = ['payment_status', 'purchase_date']
       
                