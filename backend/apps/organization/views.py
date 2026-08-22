from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import OrganizationProfile
from .serializers import OrganizationProfileSerializer

class OrganizationProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = OrganizationProfile.objects.first()
        if not profile:
            profile = OrganizationProfile.objects.create()
        serializer = OrganizationProfileSerializer(profile)
        return Response(serializer.data)

class OrganizationDetailView(generics.RetrieveUpdateAPIView):
    queryset = OrganizationProfile.objects.all()
    serializer_class = OrganizationProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        if not (request.user.is_staff or request.user.role == 'ADMIN'):
            return Response(
                {"detail": "Only Admin/HR can update organization details."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
