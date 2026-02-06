from rest_framework import serializers

from .models import Result, ResultApproval


class ResultSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_code = serializers.CharField(source='subject.subject_code', read_only=True)
    exam_type = serializers.CharField(source='exam.exam_type', read_only=True)
    exam_no = serializers.IntegerField(source='exam.exam_no', read_only=True)
    exam_date = serializers.DateField(source='exam.date', read_only=True)
    exam_time = serializers.TimeField(source='exam.start_time', read_only=True)

    class Meta:
        model = Result
        fields = [
            'id',
            'student',
            'subject',
            'exam',
            'marks',
            'grade',
            'point',
            'subject_name',
            'subject_code',
            'exam_type',
            'exam_no',
            'exam_date',
            'exam_time',
        ]


class ResultApprovalSerializer(serializers.ModelSerializer):
    exam_label = serializers.CharField(source='exam.__str__', read_only=True)
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)
    subject_name = serializers.CharField(source='exam.classroom_subject.subject.name', read_only=True)
    class_label = serializers.CharField(source='exam.classroom_subject.classroom.__str__', read_only=True)

    class Meta:
        model = ResultApproval
        fields = [
            'id',
            'exam',
            'teacher',
            'status',
            'created_at',
            'approved_at',
            'approved_by',
            'exam_label',
            'teacher_name',
            'subject_name',
            'class_label',
        ]
