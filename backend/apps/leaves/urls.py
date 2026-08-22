from django.urls import path
from .views import (
    LeaveListCreateView, 
    LeaveDetailView, 
    CancelLeaveView, 
    ApproveLeaveView, 
    RejectLeaveView
)

urlpatterns = [
    path('', LeaveListCreateView.as_view(), name='leave_list_create'),
    path('<int:pk>/', LeaveDetailView.as_view(), name='leave_detail'),
    path('<int:pk>/cancel/', CancelLeaveView.as_view(), name='leave_cancel'),
    path('<int:pk>/approve/', ApproveLeaveView.as_view(), name='leave_approve'),
    path('<int:pk>/reject/', RejectLeaveView.as_view(), name='leave_reject'),
]
