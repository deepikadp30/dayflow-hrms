from django.contrib import admin
from .models import EmployeeProfile

@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'designation', 'employment_type', 'status', 'date_of_joining')
    list_filter = ('employment_type', 'status', 'date_of_joining')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email', 'user__employee_id', 'designation')
