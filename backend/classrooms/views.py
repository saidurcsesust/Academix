from django.db.models import Count
from rest_framework import viewsets

from .models import Classroom, ClassroomSubject, Enrollment
from .serializers import ClassroomSerializer, ClassroomSubjectSerializer, EnrollmentSerializer


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.select_related('class_teacher').annotate(
        student_count=Count('enrollments'),
    )
    serializer_class = ClassroomSerializer


class ClassroomSubjectViewSet(viewsets.ModelViewSet):
    queryset = ClassroomSubject.objects.select_related('classroom', 'subject', 'teacher')
    serializer_class = ClassroomSubjectSerializer


class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Enrollment.objects.select_related('student', 'classroom')
    serializer_class = EnrollmentSerializer
