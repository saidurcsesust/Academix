from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=120)
    roll = models.PositiveIntegerField(unique=True)
    password_hash = models.CharField(max_length=255)
    class_level = models.CharField(max_length=20)
    section = models.CharField(max_length=10)
    academic_year = models.ForeignKey('core.AcademicYear', on_delete=models.PROTECT, related_name='students')

    def __str__(self):
        return f"{self.name} ({self.class_level}-{self.section})"

    @property
    def is_authenticated(self):
        return True
