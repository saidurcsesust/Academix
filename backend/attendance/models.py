from django.db import models


class Attendance(models.Model):
    STATUS_PRESENT = 'present'
    STATUS_ABSENT = 'absent'
    STATUS_LATE = 'late'
    STATUS_CHOICES = [
        (STATUS_PRESENT, 'Present'),
        (STATUS_ABSENT, 'Absent'),
        (STATUS_LATE, 'Late'),
    ]

    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='attendance')
    subject = models.ForeignKey('core.Subject', on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    class Meta:
        unique_together = ('student', 'subject', 'date')

    def __str__(self):
        return f"{self.student} - {self.date} ({self.status})"


class ClassAttendance(models.Model):
    STATUS_PRESENT = 'present'
    STATUS_ABSENT = 'absent'
    STATUS_LATE = 'late'
    STATUS_CHOICES = [
        (STATUS_PRESENT, 'Present'),
        (STATUS_ABSENT, 'Absent'),
        (STATUS_LATE, 'Late'),
    ]

    classroom = models.ForeignKey('classrooms.Classroom', on_delete=models.CASCADE, related_name='class_attendance')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='class_attendance')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PRESENT)

    class Meta:
        unique_together = ('classroom', 'student', 'date')

    def __str__(self):
        return f"{self.classroom} - {self.student} - {self.date} ({self.status})"
