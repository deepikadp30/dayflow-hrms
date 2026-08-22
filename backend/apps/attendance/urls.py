from django.urls import path
from .views import (
    AttendanceListView, 
    CheckInView, 
    CheckOutView, 
    TodayAttendanceView, 
    AttendanceDetailView
)

urlpatterns = [
    path('', AttendanceListView.as_view(), name='attendance_list'),
    path('check-in/', CheckInView.as_view(), name='attendance_check_in'),
    path('check-out/', CheckOutView.as_view(), name='attendance_check_out'),
    path('today/', TodayAttendanceView.as_view(), name='attendance_today'),
    path('<int:pk>/', AttendanceDetailView.as_view(), name='attendance_detail'),
]
