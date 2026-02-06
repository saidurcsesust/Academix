from rest_framework import viewsets

from .models import Routine
from .serializers import RoutineSerializer


class RoutineViewSet(viewsets.ModelViewSet):
    queryset = Routine.objects.select_related('subject').all().order_by('class_level', 'section', 'day_of_week', 'start_time')
    serializer_class = RoutineSerializer
