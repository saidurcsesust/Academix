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


class ResultApproval(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    exam = models.ForeignKey('exams.Exam', on_delete=models.CASCADE, related_name='approval_requests')
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='result_approvals')
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    approved_by = models.ForeignKey('admin_users.AdminUser', on_delete=models.SET_NULL, blank=True, null=True, related_name='approved_results')

    class Meta:
        unique_together = ('exam', 'teacher')

    def __str__(self):
        return f"{self.exam} - {self.teacher} ({self.status})"
