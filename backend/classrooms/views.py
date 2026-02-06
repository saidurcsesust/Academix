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

    def get_queryset(self):
        queryset = super().get_queryset()
        teacher_id = self.request.query_params.get('teacher')
        classroom_id = self.request.query_params.get('classroom')
        subject_id = self.request.query_params.get('subject')
        student_id = self.request.query_params.get('student')

        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if classroom_id:
            queryset = queryset.filter(classroom_id=classroom_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if student_id:
            enrollment = Enrollment.objects.filter(student_id=student_id).first()
            if enrollment:
                queryset = queryset.filter(classroom_id=enrollment.classroom_id)
            else:
                queryset = queryset.none()

        return queryset


class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Enrollment.objects.select_related('student', 'classroom')
    serializer_class = EnrollmentSerializer
