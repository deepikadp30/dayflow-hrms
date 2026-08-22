from django.urls import path
from .views import (
    PayrollListCreateView, 
    PayrollDetailView, 
    MyPayrollView
)

urlpatterns = [
    path('', PayrollListCreateView.as_view(), name='payroll_list_create'),
    path('me/', MyPayrollView.as_view(), name='payroll_me'),
    path('<int:pk>/', PayrollDetailView.as_view(), name='payroll_detail'),
]
