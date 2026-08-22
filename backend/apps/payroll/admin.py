from django.contrib import admin
from .models import PayrollRecord

@admin.register(PayrollRecord)
class PayrollRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'pay_period_month', 'pay_period_year', 'basic_salary', 'allowances', 'deductions', 'net_salary', 'payment_status')
    list_filter = ('payment_status', 'pay_period_year', 'pay_period_month')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email', 'user__employee_id', 'notes')
