from rest_framework import serializers
from .models import LeaveRequest

class LeaveRequestSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    employee_name = serializers.SerializerMethodField()
    employee_id = serializers.CharField(source='user.employee_id', read_only=True)
    department = serializers.CharField(source='user.department', read_only=True)
    leave_type_display = serializers.CharField(source='get_leave_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    duration_days = serializers.IntegerField(read_only=True)
    reviewed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'user_id', 'employee_name', 'employee_id', 'department',
            'leave_type', 'leave_type_display', 'start_date', 'end_date',
            'duration_days', 'reason', 'status', 'status_display',
            'admin_note', 'reviewed_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_id', 'status', 'reviewed_by_name', 'created_at', 'updated_at']

    def get_employee_name(self, obj):
        full_name = obj.user.get_full_name()
        return full_name if full_name else obj.user.username

    def get_reviewed_by_name(self, obj):
        if not obj.reviewed_by:
            return None
        full_name = obj.reviewed_by.get_full_name()
        return full_name if full_name else obj.reviewed_by.username

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({
                "end_date": "End date must be on or after start date."
            })
        return attrs
