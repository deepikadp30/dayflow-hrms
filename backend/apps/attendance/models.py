from django.db import models
from django.conf import settings
from django.utils import timezone

class AttendanceRecord(models.Model):
    class Status(models.TextChoices):
        PRESENT = 'PRESENT', 'Present'
        ABSENT = 'ABSENT', 'Absent'
        HALF_DAY = 'HALF_DAY', 'Half Day'
        LATE = 'LATE', 'Late'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    date = models.DateField(default=timezone.now)
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PRESENT
    )
    work_duration_minutes = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date', '-check_in']

    def calculate_work_duration(self):
        if self.check_in and self.check_out:
            delta = self.check_out - self.check_in
            self.work_duration_minutes = int(delta.total_seconds() // 60)
        return self.work_duration_minutes

    @property
    def formatted_duration(self):
        if not self.work_duration_minutes:
            return "0h 0m"
        hours = self.work_duration_minutes // 60
        minutes = self.work_duration_minutes % 60
        return f"{hours}h {minutes}m"

    def __str__(self):
        return f"{self.user.username} - {self.date} ({self.status})"
