from rest_framework import serializers

from .models import Exam


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'semester', 'exam_type', 'exam_no']
