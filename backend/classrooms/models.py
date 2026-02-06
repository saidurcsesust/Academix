from django.db import models


class Classroom(models.Model):
    class_level = models.CharField(max_length=20)
    section = models.CharField(max_length=10)
    academic_year = models.ForeignKey('core.AcademicYear', on_delete=models.PROTECT, related_name='classrooms')
    class_teacher = models.ForeignKey(
        'teachers.Teacher',
        on_delete=models.SET_NULL,
        related_name='homerooms',
        blank=True,
        null=True,
    )

    class Meta:
        unique_together = ('academic_year', 'class_level', 'section')

    def __str__(self):
        return f"{self.class_level}-{self.section}"


class ClassroomSubject(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='subject_assignments')
    subject = models.ForeignKey('core.Subject', on_delete=models.CASCADE, related_name='classroom_assignments')
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='subject_assignments')

    class Meta:
        unique_together = ('classroom', 'subject')

    def __str__(self):
        return f"{self.classroom} - {self.subject}"


class Enrollment(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='enrollments')
    student = models.OneToOneField('students.Student', on_delete=models.CASCADE, related_name='enrollment')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} -> {self.classroom}"
