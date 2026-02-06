from rest_framework import serializers

from .models import Exam


class ExamSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='classroom_subject.subject.name', read_only=True)
    subject_code = serializers.CharField(source='classroom_subject.subject.subject_code', read_only=True)
    class_label = serializers.CharField(source='classroom_subject.classroom.__str__', read_only=True)
    teacher_name = serializers.CharField(source='classroom_subject.teacher.name', read_only=True)

    class Meta:
        model = Exam
        fields = [
            'id',
            'semester',
            'classroom_subject',
            'exam_type',
            'exam_no',
            'date',
            'start_time',
            'duration_minutes',
            'subject_name',
            'subject_code',
            'class_label',
            'teacher_name',
        ]
