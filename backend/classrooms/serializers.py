from rest_framework import serializers

from .models import Classroom, ClassroomSubject, Enrollment


class ClassroomSerializer(serializers.ModelSerializer):
    class_teacher_name = serializers.CharField(source='class_teacher.name', read_only=True)
    academic_year_label = serializers.CharField(source='academic_year.year', read_only=True)
    student_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Classroom
        fields = [
            'id',
            'class_level',
            'section',
            'academic_year',
            'academic_year_label',
            'class_teacher',
            'class_teacher_name',
            'student_count',
        ]


class ClassroomSubjectSerializer(serializers.ModelSerializer):
    classroom_label = serializers.CharField(source='classroom.__str__', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)

    class Meta:
        model = ClassroomSubject
        fields = ['id', 'classroom', 'subject', 'teacher', 'classroom_label', 'subject_name', 'teacher_name']


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    classroom_label = serializers.CharField(source='classroom.__str__', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'classroom', 'classroom_label', 'enrolled_at']
