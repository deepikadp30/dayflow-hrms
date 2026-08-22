from django.contrib import admin
from .models import LeaveRequest

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'leave_type', 'start_date', 'end_date', 'duration_days', 'status', 'reviewed_by')
    list_filter = ('leave_type', 'status', 'start_date')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email', 'reason', 'admin_note')
