from django.contrib import admin
from .models import AttendanceRecord

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'check_in', 'check_out', 'status', 'work_duration_minutes')
    list_filter = ('status', 'date')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email', 'notes')
