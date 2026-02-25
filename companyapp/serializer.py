from rest_framework import serializers
from .models import CompanyRegistrationRequest, DealershipCompany

class CompanyRegistrationRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompanyRegistrationRequest
        fields = '__all__'
        read_only_fields = ['status', 
                            'reviewed_by', 
                            'reviewed_at'
                ]
        
class DealershipCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = DealershipCompany
        fields = '__all__'
        read_only_fields = ['approved_by', 'approved_at']