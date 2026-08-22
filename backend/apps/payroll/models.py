from django.db import models
from django.conf import settings
from decimal import Decimal
from django.core.exceptions import ValidationError

class PayrollRecord(models.Model):
    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PROCESSED = 'PROCESSED', 'Processed'
        PAID = 'PAID', 'Paid'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payroll_records'
    )
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    allowances = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    pay_period_month = models.IntegerField(help_text="Month 1-12")
    pay_period_year = models.IntegerField(help_text="Year e.g. 2026")
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    payment_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'pay_period_month', 'pay_period_year')
        ordering = ['-pay_period_year', '-pay_period_month', '-created_at']

    def clean(self):
        if self.basic_salary < 0:
            raise ValidationError({'basic_salary': 'Basic salary cannot be negative.'})
        if self.allowances < 0:
            raise ValidationError({'allowances': 'Allowances cannot be negative.'})
        if self.deductions < 0:
            raise ValidationError({'deductions': 'Deductions cannot be negative.'})
        if self.pay_period_month < 1 or self.pay_period_month > 12:
            raise ValidationError({'pay_period_month': 'Month must be between 1 and 12.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        self.net_salary = self.basic_salary + self.allowances - self.deductions
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.pay_period_month}/{self.pay_period_year} ({self.payment_status})"
