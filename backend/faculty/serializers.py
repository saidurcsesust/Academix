from rest_framework import serializers

from .models import FacultyProfile


class FacultyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyProfile
        fields = ['id', 'teacher', 'designation', 'office']
