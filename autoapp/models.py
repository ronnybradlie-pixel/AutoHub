from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):

    ROLE_CHOICES = (
        ('USER', 'User'),
        ('DEALERSHIP_ADMIN', 'Dealership Admin'),
        ('SUPER_ADMIN', 'Super Admin'),
    )

    phone_number = models.CharField(max_length=20, blank=True,)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='USER') 
    dealership = models.ForeignKey(
        'dealerships.DealershipCompany', 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='admins'
    )
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username