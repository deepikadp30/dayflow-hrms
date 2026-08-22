from rest_framework import generics, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import EmployeeProfile
from .serializers import (
    EmployeeListSerializer, 
    EmployeeDetailSerializer, 
    EmployeeUpdateSerializer
)

class IsAdminOrSelf(permissions.BasePermission):
    """
    Custom permission: Admin/HR can edit any profile.
    Employees can view profiles, but can only edit their own profile.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff or request.user.role == 'ADMIN' or obj.user == request.user

class EmployeeListView(generics.ListAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = EmployeeProfile.objects.select_related('user').all().order_by('-user__date_joined')
        
        # Search query (by name, employee_id, or email)
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__username__icontains=search) |
                Q(user__email__icontains=search) |
                Q(user__employee_id__icontains=search)
            )

        # Department filter
        department = self.request.query_params.get('department', '').strip()
        if department:
            queryset = queryset.filter(user__department__iexact=department)

        # Designation filter
        designation = self.request.query_params.get('designation', '').strip()
        if designation:
            queryset = queryset.filter(designation__icontains=designation)

        # Employment type filter
        employment_type = self.request.query_params.get('employment_type', '').strip()
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type.upper())

        # Status filter
        status_param = self.request.query_params.get('status', '').strip()
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        return queryset

class EmployeeDetailView(generics.RetrieveUpdateAPIView):
    queryset = EmployeeProfile.objects.select_related('user').all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EmployeeUpdateSerializer
        return EmployeeDetailSerializer

class CurrentEmployeeProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = EmployeeProfile.objects.get_or_create(user=request.user)
        serializer = EmployeeDetailSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Employees cannot alter protected parameters like role or status directly via self-edit
        data = request.data.copy()
        if request.user.role != 'ADMIN' and not request.user.is_staff:
            data.pop('role', None)
            data.pop('status', None)
            data.pop('employee_id', None)

        serializer = EmployeeUpdateSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            updated_profile = EmployeeDetailSerializer(profile).data
            return Response(updated_profile)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
