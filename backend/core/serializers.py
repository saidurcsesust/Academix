from rest_framework import serializers

from .models import (
    AcademicYear,
    Semester,
    SemesterSubject,
    Subject,
)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'subject_code']


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'year']


class SemesterSerializer(serializers.ModelSerializer):
    academic_year_label = serializers.CharField(source='academic_year.year', read_only=True)

    class Meta:
        model = Semester
        fields = ['id', 'academic_year', 'academic_year_label', 'semester_no']


class SemesterSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SemesterSubject
        fields = ['id', 'semester', 'subject']
