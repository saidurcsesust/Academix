from django.db import models


class FacultyProfile(models.Model):
    teacher = models.OneToOneField('teachers.Teacher', on_delete=models.CASCADE, related_name='faculty_profile')
    designation = models.CharField(max_length=120, blank=True)
    office = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return f"{self.teacher.name}"
