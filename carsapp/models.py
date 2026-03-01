from django.db import models
from django.conf import settings

# Create your models here.
class Car(models.Model):

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('SOLD', 'Sold'),
        ('RENTED', 'Rented'),
    )

    dealership = models.ForeignKey(    
        'companyapp.DealershipCompany',
        on_delete=models.CASCADE,
        related_name='cars'
    )    

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='submitted_cars'
    )

    is_company_owned = models.BooleanField(default=False)

    title = models.CharField(max_length=255)    
    description = models.TextField()
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    mileage = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    engine_capacity = models.DecimalField(max_digits=5, decimal_places=2)
    fuel_type = models.CharField(max_length=50)
    transmission = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    rental_price_per_day = models.DecimalField(max_digits=10,decimal_places=2)

    is_for_sale = models.BooleanField(default=True)
    is_for_rent = models.BooleanField(default=False)

    approved_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='approved_cars'
    )

    approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"


class CarImage(models.Model):

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(upload_to='car_images/')
    is_primary = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

class CarInspection(models.Model):

    car = models.OneToOneField(
        Car,
        on_delete=models.CASCADE,
        related_name='inspection'
    )

    inspected_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    mechanical_status = models.TextField()
    interior_status = models.TextField()
    exterior_status = models.TextField()
    condition_notes = models.TextField()

    approved = models.BooleanField(default=False)
    inspection_date = models.DateTimeField(auto_now_add=True)  