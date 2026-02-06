from rest_framework import viewsets

from classrooms.models import Enrollment

from .models import Exam
from .serializers import ExamSerializer


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.select_related('semester', 'semester__academic_year').all().order_by(
        '-semester__academic_year__year',
        'semester__semester_no',
        'exam_type',
        'exam_no',
    )
    serializer_class = ExamSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related(
            'classroom_subject',
            'classroom_subject__classroom',
            'classroom_subject__subject',
            'classroom_subject__teacher',
        )
        student_id = self.request.query_params.get('student')
        teacher_id = self.request.query_params.get('teacher')

        if student_id:
            enrollment = Enrollment.objects.filter(student_id=student_id).first()
            if enrollment:
                queryset = queryset.filter(classroom_subject__classroom_id=enrollment.classroom_id)
            else:
                queryset = queryset.none()

        if teacher_id:
            queryset = queryset.filter(classroom_subject__teacher_id=teacher_id)

        return queryset
