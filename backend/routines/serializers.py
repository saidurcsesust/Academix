from rest_framework import serializers

from .models import Routine


class RoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Routine
        fields = ['id', 'class_level', 'section', 'subject', 'day_of_week', 'start_time', 'end_time']
