from rest_framework import serializers
from .models import Car, CarImage, CarInspection

class CarImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = CarImage
        fields = [
                'id',
                'image',
                'is_primary'
            ]
        
class CarInspectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = CarInspection
        fields = '__all__'
        read_only_fields = ['inspection_date']

class CarSerializer(serializers.ModelSerializer):

    images = CarImageSerializer(many=True, read_only=True)
    inspection = CarInspectionSerializer(read_only=True)

    class Meta:
        model = Car
        fields = '__all__'
        read_only_fields = ['status', 'approved_by', 'approved_at']  

class CarCreateSerializer(serializers.ModelSerializer):

    images = CarImageSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Car
        exclude = ['status', 'approved_by', 'approved_at']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        car = Car.objects.create(**validated_data)

        for image_data in images_data:
            CarImage.objects.create(car=car, **image_data)

        return car                      