from django.db import models

class OrganizationProfile(models.Model):
    company_name = models.CharField(max_length=150, default='Dayflow HR Inc.')
    company_email = models.EmailField(default='contact@dayflow.hr')
    company_phone = models.CharField(max_length=30, default='+1 (555) 019-2834')
    address = models.TextField(default='100 Innovation Way, Suite 400')
    city = models.CharField(max_length=100, default='San Francisco')
    state = models.CharField(max_length=100, default='CA')
    country = models.CharField(max_length=100, default='United States')
    postal_code = models.CharField(max_length=20, default='94105')
    website = models.URLField(default='https://dayflow.hr')
    timezone = models.CharField(max_length=50, default='UTC')
    logo_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} Profile"
