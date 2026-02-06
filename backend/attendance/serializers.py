from rest_framework import serializers

from .models import Attendance, ClassAttendance


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'subject', 'date', 'status']


class ClassAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_roll = serializers.IntegerField(source='student.roll', read_only=True)
    classroom_label = serializers.CharField(source='classroom.__str__', read_only=True)

    class Meta:
        model = ClassAttendance
        fields = ['id', 'classroom', 'classroom_label', 'student', 'student_name', 'student_roll', 'date', 'status']
