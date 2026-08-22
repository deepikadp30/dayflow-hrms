from django.contrib import admin
from .models import OrganizationProfile

@admin.register(OrganizationProfile)
class OrganizationProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'company_email', 'company_phone', 'city', 'country', 'website')
