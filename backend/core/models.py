from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=120)
    class_level = models.CharField(max_length=20)
    section = models.CharField(max_length=10)
    roll = models.PositiveIntegerField()
    email = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.class_level}-{self.section})"


class Exam(models.Model):
    title = models.CharField(max_length=120)
    subject = models.CharField(max_length=120)
    date = models.DateField()
    start_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=90)

    def __str__(self):
        return f"{self.title} - {self.subject}"


class Attendance(models.Model):
    STATUS_PRESENT = 'present'
    STATUS_ABSENT = 'absent'
    STATUS_LATE = 'late'
    STATUS_CHOICES = [
        (STATUS_PRESENT, 'Present'),
        (STATUS_ABSENT, 'Absent'),
        (STATUS_LATE, 'Late'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    notes = models.CharField(max_length=200, blank=True)

    class Meta:
        unique_together = ('student', 'date')

    def __str__(self):
        return f"{self.student.name} - {self.date} ({self.status})"


class Notice(models.Model):
    title = models.CharField(max_length=160)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# Create your models here.
