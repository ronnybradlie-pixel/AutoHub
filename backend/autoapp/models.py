from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The email field is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('super user must have is_staff true')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('super user must have is_super true')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):

    ROLE_CHOICES = (
        ('USER', 'User'),
        ('DEALERSHIP_ADMIN', 'Dealership Admin'),
        ('SUPER_ADMIN', 'Super Admin'),
    )

    phone_number = models.CharField(max_length=20, blank=True,)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='USER') 
    dealership = models.ForeignKey(
        'companyapp.DealershipCompany', 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='admins'
    )
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username