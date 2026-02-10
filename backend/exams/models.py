from django.db import models


class Exam(models.Model):
    EXAM_TYPE_CLASS_TEST = 'class_test'
    EXAM_TYPE_SEMESTER_FINAL = 'semester_final'
    EXAM_TYPE_CHOICES = [
        (EXAM_TYPE_CLASS_TEST, 'Class Test'),
        (EXAM_TYPE_SEMESTER_FINAL, 'Semester Final'),
    ]

    semester = models.ForeignKey('core.Semester', on_delete=models.CASCADE, related_name='exams')
    classroom_subject = models.ForeignKey(
        'classrooms.ClassroomSubject',
        on_delete=models.SET_NULL,
        related_name='exams',
        blank=True,
        null=True,
    )
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
    exam_no = models.PositiveSmallIntegerField(blank=True, null=True)
    syllabus = models.TextField(blank=True, default='')
    date = models.DateField()
    start_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=90)
    created_by_admin = models.ForeignKey(
        'admin_users.AdminUser',
        on_delete=models.SET_NULL,
        related_name='created_exams',
        null=True,
        blank=True,
    )

    class Meta:
        unique_together = ('semester', 'exam_type', 'exam_no')

    def __str__(self):
        if self.exam_type == self.EXAM_TYPE_CLASS_TEST:
            return f"{self.semester} - CT-{self.exam_no}"
        return f"{self.semester} - Semester Final"
