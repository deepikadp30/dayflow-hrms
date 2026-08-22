from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        EMPLOYEE = 'EMPLOYEE', 'Employee'
        ADMIN = 'ADMIN', 'Admin / HR'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EMPLOYEE,
        help_text='Role dictating application access level'
    )
    department = models.CharField(max_length=100, blank=True, null=True)
    employee_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_admin_hr(self):
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def is_employee(self):
        return self.role == self.Role.EMPLOYEE

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
