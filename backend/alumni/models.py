from django.db import models


class Alumni(models.Model):
    name = models.CharField(max_length=120)
    graduation_year = models.CharField(max_length=9)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    department = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return f"{self.name} ({self.graduation_year})"
