from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import PayrollRecord
from .serializers import PayrollSerializer

User = get_user_model()

class PayrollListCreateView(generics.ListCreateAPIView):
    serializer_class = PayrollSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            queryset = PayrollRecord.objects.select_related('user').all()
        else:
            queryset = PayrollRecord.objects.select_related('user').filter(user=user)

        # Filters
        employee_param = self.request.query_params.get('employee', '').strip()
        if employee_param and (user.is_staff or user.role == 'ADMIN'):
            queryset = queryset.filter(user_id=employee_param)

        month_param = self.request.query_params.get('month', '').strip()
        if month_param:
            queryset = queryset.filter(pay_period_month=month_param)

        year_param = self.request.query_params.get('year', '').strip()
        if year_param:
            queryset = queryset.filter(pay_period_year=year_param)

        status_param = self.request.query_params.get('payment_status', '').strip()
        if status_param:
            queryset = queryset.filter(payment_status=status_param.upper())

        return queryset.order_by('-pay_period_year', '-pay_period_month', '-created_at')

    def create(self, request, *args, **kwargs):
        if not (request.user.is_staff or request.user.role == 'ADMIN'):
            return Response(
                {"detail": "Only Admin/HR can create payroll records."},
                status=status.HTTP_403_FORBIDDEN
            )

        user_id = request.data.get('user_id') or request.data.get('user')
        if not user_id:
            return Response(
                {"detail": "Target user ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            target_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Target user not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        month = request.data.get('pay_period_month')
        year = request.data.get('pay_period_year')

        # Duplicate check for same user and pay period
        if PayrollRecord.objects.filter(user=target_user, pay_period_month=month, pay_period_year=year).exists():
            return Response(
                {"detail": f"Payroll for {target_user.username} for period {month}/{year} already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=target_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PayrollDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PayrollSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return PayrollRecord.objects.select_related('user').all()
        return PayrollRecord.objects.select_related('user').filter(user=user)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_staff or request.user.role == 'ADMIN'):
            return Response(
                {"detail": "Only Admin/HR can update payroll records."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

class MyPayrollView(generics.ListAPIView):
    serializer_class = PayrollSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PayrollRecord.objects.filter(user=self.request.user).order_by('-pay_period_year', '-pay_period_month')
