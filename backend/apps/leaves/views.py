from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer

class LeaveListCreateView(generics.ListCreateAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            queryset = LeaveRequest.objects.select_related('user', 'reviewed_by').all()
        else:
            queryset = LeaveRequest.objects.select_related('user', 'reviewed_by').filter(user=user)

        # Filters
        status_param = self.request.query_params.get('status', '').strip()
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        type_param = self.request.query_params.get('leave_type', '').strip()
        if type_param:
            queryset = queryset.filter(leave_type=type_param.upper())

        user_id_param = self.request.query_params.get('user', '').strip()
        if user_id_param and (user.is_staff or user.role == 'ADMIN'):
            queryset = queryset.filter(user_id=user_id_param)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status=LeaveRequest.Status.PENDING)

class LeaveDetailView(generics.RetrieveAPIView):
    queryset = LeaveRequest.objects.select_related('user', 'reviewed_by').all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return LeaveRequest.objects.all()
        return LeaveRequest.objects.filter(user=user)

class CancelLeaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            leave = LeaveRequest.objects.get(pk=pk, user=request.user)
        except LeaveRequest.DoesNotExist:
            return Response(
                {"detail": "Leave request not found or unauthorized."},
                status=status.HTTP_404_NOT_FOUND
            )

        if leave.status != LeaveRequest.Status.PENDING:
            return Response(
                {"detail": f"Cannot cancel a leave request that is already {leave.get_status_display().lower()}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        leave.status = LeaveRequest.Status.CANCELLED
        leave.save()
        serializer = LeaveRequestSerializer(leave)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ApproveLeaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if not (request.user.is_staff or request.user.role == 'ADMIN'):
            return Response(
                {"detail": "Only Admin/HR can approve leave requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            leave = LeaveRequest.objects.get(pk=pk)
        except LeaveRequest.DoesNotExist:
            return Response(
                {"detail": "Leave request not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if leave.user == request.user:
            return Response(
                {"detail": "Admins cannot approve their own leave requests."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if leave.status != LeaveRequest.Status.PENDING:
            return Response(
                {"detail": f"Cannot approve a leave request that is already {leave.get_status_display().lower()}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        leave.status = LeaveRequest.Status.APPROVED
        leave.reviewed_by = request.user
        admin_note = request.data.get('admin_note', '')
        if admin_note:
            leave.admin_note = admin_note
        leave.save()

        serializer = LeaveRequestSerializer(leave)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RejectLeaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if not (request.user.is_staff or request.user.role == 'ADMIN'):
            return Response(
                {"detail": "Only Admin/HR can reject leave requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            leave = LeaveRequest.objects.get(pk=pk)
        except LeaveRequest.DoesNotExist:
            return Response(
                {"detail": "Leave request not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if leave.user == request.user:
            return Response(
                {"detail": "Admins cannot reject their own leave requests."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if leave.status != LeaveRequest.Status.PENDING:
            return Response(
                {"detail": f"Cannot reject a leave request that is already {leave.get_status_display().lower()}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        leave.status = LeaveRequest.Status.REJECTED
        leave.reviewed_by = request.user
        admin_note = request.data.get('admin_note', '')
        if admin_note:
            leave.admin_note = admin_note
        leave.save()

        serializer = LeaveRequestSerializer(leave)
        return Response(serializer.data, status=status.HTTP_200_OK)
