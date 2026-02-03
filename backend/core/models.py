from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=120)
    roll = models.PositiveIntegerField(unique=True)
    password_hash = models.CharField(max_length=255)
    class_level = models.CharField(max_length=20)
    section = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.name} ({self.class_level}-{self.section})"

    @property
    def is_authenticated(self):
        return True


class Teacher(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    department = models.CharField(max_length=120)
    role = models.CharField(max_length=80)
    password_hash = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.department})"


class AdminUser(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)

    def __str__(self):
        return self.name


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


class Exam(models.Model):
    EXAM_TYPE_CLASS_TEST = 'class_test'
    EXAM_TYPE_SEMESTER_FINAL = 'semester_final'
    EXAM_TYPE_CHOICES = [
        (EXAM_TYPE_CLASS_TEST, 'Class Test'),
        (EXAM_TYPE_SEMESTER_FINAL, 'Semester Final'),
    ]

    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='exams')
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
    exam_no = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        unique_together = ('semester', 'exam_type', 'exam_no')

    def __str__(self):
        if self.exam_type == self.EXAM_TYPE_CLASS_TEST:
            return f"{self.semester} - CT-{self.exam_no}"
        return f"{self.semester} - Semester Final"


class SemesterSubject(models.Model):
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='semester_subjects')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='semester_subjects')

    class Meta:
        unique_together = ('semester', 'subject')

    def __str__(self):
        return f"{self.semester} - {self.subject}"


class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='results')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='results')
    marks = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=5)
    point = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        unique_together = ('student', 'subject', 'exam')

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.exam}"


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
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    class Meta:
        unique_together = ('student', 'subject', 'date')

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.date} ({self.status})"


class Routine(models.Model):
    class_level = models.CharField(max_length=20)
    section = models.CharField(max_length=10)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='routines')
    day_of_week = models.PositiveSmallIntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ('class_level', 'section', 'subject', 'day_of_week', 'start_time')

    def __str__(self):
        return f"{self.class_level}-{self.section} {self.subject} ({self.day_of_week})"


class Notice(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField()
    date = models.DateField()
    pdf_file = models.FileField(upload_to='notices/', blank=True)

    def __str__(self):
        return self.title
