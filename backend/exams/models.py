from django.db import models


class Exam(models.Model):
    EXAM_TYPE_CLASS_TEST = 'class_test'
    EXAM_TYPE_SEMESTER_FINAL = 'semester_final'
    EXAM_TYPE_CHOICES = [
        (EXAM_TYPE_CLASS_TEST, 'Class Test'),
        (EXAM_TYPE_SEMESTER_FINAL, 'Semester Final'),
    ]

    semester = models.ForeignKey('core.Semester', on_delete=models.CASCADE, related_name='exams')
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
    exam_no = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        unique_together = ('semester', 'exam_type', 'exam_no')

    def __str__(self):
        if self.exam_type == self.EXAM_TYPE_CLASS_TEST:
            return f"{self.semester} - CT-{self.exam_no}"
        return f"{self.semester} - Semester Final"
