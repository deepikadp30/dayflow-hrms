from rest_framework import serializers
from .models import AttendanceRecord

class AttendanceSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    employee_name = serializers.SerializerMethodField()
    employee_id = serializers.CharField(source='user.employee_id', read_only=True)
    department = serializers.CharField(source='user.department', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    formatted_duration = serializers.CharField(read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'user_id', 'employee_name', 'employee_id', 'department',
            'date', 'check_in', 'check_out', 'status', 'status_display',
            'work_duration_minutes', 'formatted_duration', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_id', 'date', 'check_in', 'check_out', 'created_at', 'updated_at']

    def get_employee_name(self, obj):
        full_name = obj.user.get_full_name()
        return full_name if full_name else obj.user.username
