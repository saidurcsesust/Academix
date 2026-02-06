from django.db import models


class Result(models.Model):
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='results')
    subject = models.ForeignKey('core.Subject', on_delete=models.CASCADE, related_name='results')
    exam = models.ForeignKey('exams.Exam', on_delete=models.CASCADE, related_name='results')
    marks = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=5)
    point = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        unique_together = ('student', 'subject', 'exam')

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.exam}"
