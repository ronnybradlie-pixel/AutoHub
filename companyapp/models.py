from django.db import models
from django.conf import settings

# Create your models here.
class CompanyRegistrationRequest(models.Model):

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )
        
    company_name = models.CharField(max_length=255)
    company_email = models.EmailField()
    company_phone = models.CharField(max_length=20)
    company_city = models.CharField(max_length=100)
    company_license_number = models.CharField(max_length=100)
    company_license_document = models.FileField(upload_to='company_licenses/')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    submitted_at = models.DateTimeField(auto_now_add=True)

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_companies'
        )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name
    
    class DealershipCompany(models.Model):

        name = models.CharField(max_length=255)
        email = models.EmailField()
        phone = models.CharField(max_length=20)
        city = models.CharField(max_length=100)

        license_number = models.CharField(max_length=100)
        license_document = models.FileField(upload_to='approved_licenses/')

        is_active = models.BooleanField(default=True)

        approved_by = models.ForeignKey(
            settings.AUTH_USER_MODEL, 
            on_delete=models.SET_NULL,
            null=True,
            related_name='approved_dealerships'
            )
        approved_at = models.DateTimeField()

        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)

        def __str__(self):
            return self.name