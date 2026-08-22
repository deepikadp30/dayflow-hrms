from django.db import models
from django.conf import settings

class LeaveRequest(models.Model):
    class LeaveType(models.TextChoices):
        CASUAL = 'CASUAL', 'Casual Leave'
        SICK = 'SICK', 'Sick Leave'
        EARNED = 'EARNED', 'Earned Leave'
        UNPAID = 'UNPAID', 'Unpaid Leave'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        CANCELLED = 'CANCELLED', 'Cancelled'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leave_requests'
    )
    leave_type = models.CharField(
        max_length=20,
        choices=LeaveType.choices,
        default=LeaveType.CASUAL
    )
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    admin_note = models.TextField(blank=True, null=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='reviewed_leaves',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def duration_days(self):
        if self.start_date and self.end_date:
            delta = (self.end_date - self.start_date).days + 1
            return max(delta, 1)
        return 1

    def __str__(self):
        return f"{self.user.username} - {self.get_leave_type_display()} ({self.status})"
