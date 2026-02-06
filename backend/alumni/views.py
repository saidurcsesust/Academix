from rest_framework import viewsets

from .models import Alumni
from .serializers import AlumniSerializer


class AlumniViewSet(viewsets.ModelViewSet):
    queryset = Alumni.objects.all().order_by('-graduation_year', 'name')
    serializer_class = AlumniSerializer
