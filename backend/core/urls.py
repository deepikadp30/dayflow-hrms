from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/employees/', include('apps.employees.urls')),
    path('api/attendance/', include('apps.attendance.urls')),
    path('api/leaves/', include('apps.leaves.urls')),
]
