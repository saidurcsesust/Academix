from django.db import models


class Routine(models.Model):
    class_level = models.CharField(max_length=20)
    section = models.CharField(max_length=10)
    subject = models.ForeignKey('core.Subject', on_delete=models.CASCADE, related_name='routines')
    day_of_week = models.PositiveSmallIntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ('class_level', 'section', 'subject', 'day_of_week', 'start_time')

    def __str__(self):
        return f"{self.class_level}-{self.section} {self.subject} ({self.day_of_week})"
