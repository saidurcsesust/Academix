from rest_framework import serializers

from .models import (
    AcademicYear,
    Attendance,
    Exam,
    Notice,
    Result,
    Routine,
    Semester,
    SemesterSubject,
    Student,
    Subject,
)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'roll', 'password_hash', 'class_level', 'section']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'subject_code']


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'year']


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['id', 'academic_year', 'semester_no']


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'semester', 'exam_type', 'exam_no']


class SemesterSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SemesterSubject
        fields = ['id', 'semester', 'subject']


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'student', 'subject', 'exam', 'marks', 'grade', 'point']


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'subject', 'date', 'status']


class RoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Routine
        fields = ['id', 'class_level', 'section', 'subject', 'day_of_week', 'start_time', 'end_time']


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ['id', 'title', 'description', 'date', 'pdf_file']
