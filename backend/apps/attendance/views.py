from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import AttendanceRecord
from .serializers import AttendanceSerializer

class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admins can view all attendance; employees see only their own
        if user.is_staff or user.role == 'ADMIN':
            queryset = AttendanceRecord.objects.select_related('user').all()
        else:
            queryset = AttendanceRecord.objects.select_related('user').filter(user=user)

        # Filters
        date_param = self.request.query_params.get('date', '').strip()
        if date_param:
            queryset = queryset.filter(date=date_param)

        user_id_param = self.request.query_params.get('user', '').strip()
        if user_id_param and (user.is_staff or user.role == 'ADMIN'):
            queryset = queryset.filter(user_id=user_id_param)

        status_param = self.request.query_params.get('status', '').strip()
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        return queryset.order_by('-date', '-check_in')

class CheckInView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        record, created = AttendanceRecord.objects.get_or_create(
            user=request.user,
            date=today
        )

        if not created and record.check_in is not None:
            return Response(
                {"detail": "Already checked in for today."},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()
        record.check_in = now
        record.status = AttendanceRecord.Status.PRESENT
        notes = request.data.get('notes', '')
        if notes:
            record.notes = notes
        record.save()

        serializer = AttendanceSerializer(record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CheckOutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        try:
            record = AttendanceRecord.objects.get(user=request.user, date=today)
        except AttendanceRecord.DoesNotExist:
            return Response(
                {"detail": "No check-in record found for today. Please check in first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if record.check_in is None:
            return Response(
                {"detail": "Must check in before checking out."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if record.check_out is not None:
            return Response(
                {"detail": "Already checked out for today."},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()
        record.check_out = now
        record.calculate_work_duration()
        notes = request.data.get('notes', '')
        if notes:
            record.notes = (record.notes + " | " + notes) if record.notes else notes
        record.save()

        serializer = AttendanceSerializer(record)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TodayAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        record = AttendanceRecord.objects.filter(user=request.user, date=today).first()
        if not record:
            return Response({"checked_in": False, "checked_out": False, "record": None})
        
        serializer = AttendanceSerializer(record)
        return Response({
            "checked_in": record.check_in is not None,
            "checked_out": record.check_out is not None,
            "record": serializer.data
        })

class AttendanceDetailView(generics.RetrieveAPIView):
    queryset = AttendanceRecord.objects.select_related('user').all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return AttendanceRecord.objects.all()
        return AttendanceRecord.objects.filter(user=user)
