from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EmployeeProfile

User = get_user_model()

class EmployeeListSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    department = serializers.CharField(source='user.department', read_only=True)
    employee_id = serializers.CharField(source='user.employee_id', read_only=True)
    full_name = serializers.SerializerMethodField()
    employment_type_display = serializers.CharField(source='get_employment_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'user_id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'employee_id', 'department', 'designation', 
            'employment_type', 'employment_type_display', 'status', 
            'status_display', 'role', 'phone', 'avatar_url', 'date_of_joining'
        ]

    def get_full_name(self, obj):
        name = obj.user.get_full_name()
        return name if name else obj.user.username

class EmployeeDetailSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    department = serializers.CharField(source='user.department', read_only=True)
    employee_id = serializers.CharField(source='user.employee_id', read_only=True)
    full_name = serializers.SerializerMethodField()
    employment_type_display = serializers.CharField(source='get_employment_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'user_id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'employee_id', 'department', 'designation', 
            'phone', 'date_of_joining', 'employment_type', 
            'employment_type_display', 'status', 'status_display', 
            'role', 'avatar_url', 'created_at', 'updated_at'
        ]

    def get_full_name(self, obj):
        name = obj.user.get_full_name()
        return name if name else obj.user.username

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    employee_id = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            'first_name', 'last_name', 'email', 'department', 'employee_id',
            'phone', 'designation', 'date_of_joining', 'employment_type', 
            'status', 'avatar_url'
        ]

    def update(self, instance, validated_data):
        user = instance.user

        # User fields update
        if 'first_name' in validated_data:
            user.first_name = validated_data.pop('first_name')
        if 'last_name' in validated_data:
            user.last_name = validated_data.pop('last_name')
        if 'email' in validated_data:
            user.email = validated_data.pop('email')
        if 'department' in validated_data:
            user.department = validated_data.pop('department')
        if 'employee_id' in validated_data:
            user.employee_id = validated_data.pop('employee_id')
        user.save()

        # EmployeeProfile fields update
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
