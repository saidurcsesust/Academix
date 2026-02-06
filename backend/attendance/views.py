from rest_framework import viewsets

from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('student', 'subject').all().order_by('-date')
    serializer_class = AttendanceSerializer
