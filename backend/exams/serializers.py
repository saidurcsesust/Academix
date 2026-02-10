from rest_framework import serializers

from .models import Exam


class ExamSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='classroom_subject.subject.name', read_only=True)
    subject_code = serializers.CharField(source='classroom_subject.subject.subject_code', read_only=True)
    class_label = serializers.CharField(source='classroom_subject.classroom.__str__', read_only=True)
    class_level = serializers.CharField(source='classroom_subject.classroom.class_level', read_only=True)
    section = serializers.CharField(source='classroom_subject.classroom.section', read_only=True)
    teacher_name = serializers.CharField(source='classroom_subject.teacher.name', read_only=True)
    created_by_admin_name = serializers.CharField(source='created_by_admin.name', read_only=True)

    class Meta:
        model = Exam
        fields = [
            'id',
            'semester',
            'classroom_subject',
            'exam_type',
            'exam_no',
            'syllabus',
            'date',
            'start_time',
            'duration_minutes',
            'created_by_admin',
            'subject_name',
            'subject_code',
            'class_label',
            'class_level',
            'section',
            'teacher_name',
            'created_by_admin_name',
        ]
