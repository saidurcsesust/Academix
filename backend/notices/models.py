from django.db import models


class Notice(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField()
    date = models.DateField()
    pdf_file = models.FileField(upload_to='notices/', blank=True)

    def __str__(self):
        return self.title
