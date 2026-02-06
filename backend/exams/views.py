from rest_framework import viewsets

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
