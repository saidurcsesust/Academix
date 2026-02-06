from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=120)
    subject_code = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return f"{self.name} ({self.subject_code})"


class AcademicYear(models.Model):
    year = models.CharField(max_length=9, unique=True)

    def __str__(self):
        return self.year


class Semester(models.Model):
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='semesters')
    semester_no = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ('academic_year', 'semester_no')

    def __str__(self):
        return f"{self.academic_year.year} - Semester {self.semester_no}"


class SemesterSubject(models.Model):
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='semester_subjects')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='semester_subjects')

    class Meta:
        unique_together = ('semester', 'subject')

    def __str__(self):
        return f"{self.semester} - {self.subject}"

