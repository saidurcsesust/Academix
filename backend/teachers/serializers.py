from rest_framework import serializers

from .models import Teacher


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'name', 'email', 'phone', 'department', 'role', 'password_hash']
        extra_kwargs = {'password_hash': {'write_only': True}}
