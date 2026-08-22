from rest_framework import serializers
from .models import PayrollRecord

class PayrollSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    employee_name = serializers.SerializerMethodField()
    employee_id = serializers.CharField(source='user.employee_id', read_only=True)
    department = serializers.CharField(source='user.department', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = PayrollRecord
        fields = [
            'id', 'user_id', 'employee_name', 'employee_id', 'department',
            'basic_salary', 'allowances', 'deductions', 'net_salary',
            'pay_period_month', 'pay_period_year', 'payment_status',
            'payment_status_display', 'payment_date', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_id', 'net_salary', 'created_at', 'updated_at']

    def get_employee_name(self, obj):
        full_name = obj.user.get_full_name()
        return full_name if full_name else obj.user.username

    def validate_basic_salary(self, value):
        if value < 0:
            raise serializers.ValidationError("Basic salary cannot be negative.")
        return value

    def validate_allowances(self, value):
        if value < 0:
            raise serializers.ValidationError("Allowances cannot be negative.")
        return value

    def validate_deductions(self, value):
        if value < 0:
            raise serializers.ValidationError("Deductions cannot be negative.")
        return value
