from django.urls import path
from .views import (
    EmployeeListView, 
    EmployeeDetailView, 
    CurrentEmployeeProfileView
)

urlpatterns = [
    path('', EmployeeListView.as_view(), name='employee_list'),
    path('me/', CurrentEmployeeProfileView.as_view(), name='employee_me'),
    path('<int:pk>/', EmployeeDetailView.as_view(), name='employee_detail'),
]
