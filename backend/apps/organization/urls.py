from django.urls import path
from .views import OrganizationProfileView, OrganizationDetailView

urlpatterns = [
    path('', OrganizationProfileView.as_view(), name='organization_profile'),
    path('<int:pk>/', OrganizationDetailView.as_view(), name='organization_detail'),
]
