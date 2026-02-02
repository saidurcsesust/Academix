from rest_framework import serializers

from .models import Attendance, Exam, Notice, Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'class_level', 'section', 'roll', 'email']


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'title', 'subject', 'date', 'start_time', 'duration_minutes']


class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        source='student',
        queryset=Student.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_id', 'date', 'status', 'notes']


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ['id', 'title', 'body', 'created_at']
