from rest_framework import viewsets

from .models import Attendance, Exam, Notice, Student
from .serializers import AttendanceSerializer, ExamSerializer, NoticeSerializer, StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('roll')
    serializer_class = StudentSerializer


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().order_by('date', 'start_time')
    serializer_class = ExamSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('student').all().order_by('-date')
    serializer_class = AttendanceSerializer


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all().order_by('-created_at')
    serializer_class = NoticeSerializer
