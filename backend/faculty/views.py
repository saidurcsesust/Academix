from rest_framework import viewsets

from .models import FacultyProfile
from .serializers import FacultyProfileSerializer


class FacultyProfileViewSet(viewsets.ModelViewSet):
    queryset = FacultyProfile.objects.select_related('teacher').all().order_by('teacher__name')
    serializer_class = FacultyProfileSerializer
