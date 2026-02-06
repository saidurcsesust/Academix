from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'roll', 'password_hash', 'class_level', 'section', 'academic_year']
        extra_kwargs = {'password_hash': {'write_only': True}}
