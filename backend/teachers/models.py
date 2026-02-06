from django.db import models


class Teacher(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    department = models.CharField(max_length=120)
    role = models.CharField(max_length=80)
    password_hash = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.department})"
