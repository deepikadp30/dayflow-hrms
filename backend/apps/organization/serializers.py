from rest_framework import serializers
from .models import OrganizationProfile

class OrganizationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationProfile
        fields = [
            'id', 'company_name', 'company_email', 'company_phone',
            'address', 'city', 'state', 'country', 'postal_code',
            'website', 'timezone', 'logo_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
