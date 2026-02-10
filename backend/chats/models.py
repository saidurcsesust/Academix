from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
import uuid


class ChatRoom(models.Model):
    room_code = models.CharField(max_length=14, unique=True, editable=False)
    name = models.CharField(max_length=180)
    classroom_subject = models.OneToOneField(
        'classrooms.ClassroomSubject',
        on_delete=models.CASCADE,
        related_name='chat_room',
    )
    classroom = models.ForeignKey('classrooms.Classroom', on_delete=models.CASCADE, related_name='chat_rooms')
    subject = models.ForeignKey('core.Subject', on_delete=models.CASCADE, related_name='chat_rooms')
    moderator_teacher = models.ForeignKey(
        'teachers.Teacher',
        on_delete=models.SET_NULL,
        related_name='moderated_chat_rooms',
        null=True,
        blank=True,
    )
    created_by_admin = models.ForeignKey(
        'admin_users.AdminUser',
        on_delete=models.SET_NULL,
        related_name='created_chat_rooms',
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.room_code:
            while True:
                candidate = f"CHAT-{uuid.uuid4().hex[:8].upper()}"
                if not ChatRoom.objects.filter(room_code=candidate).exists():
                    self.room_code = candidate
                    break
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ChatRoomMember(models.Model):
    ROLE_SUPER_ADMIN = 'super_admin'
    ROLE_MODERATOR = 'moderator'
    ROLE_MEMBER = 'member'
    ROLE_CHOICES = [
        (ROLE_SUPER_ADMIN, 'Super Admin'),
        (ROLE_MODERATOR, 'Moderator'),
        (ROLE_MEMBER, 'Member'),
    ]

    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='chat_memberships', null=True, blank=True)
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='chat_memberships', null=True, blank=True)
    admin_user = models.ForeignKey('admin_users.AdminUser', on_delete=models.CASCADE, related_name='chat_memberships', null=True, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['room_id', 'id']
        constraints = [
            models.UniqueConstraint(fields=['room', 'student'], condition=Q(student__isnull=False), name='uniq_room_student_member'),
            models.UniqueConstraint(fields=['room', 'teacher'], condition=Q(teacher__isnull=False), name='uniq_room_teacher_member'),
            models.UniqueConstraint(fields=['room', 'admin_user'], condition=Q(admin_user__isnull=False), name='uniq_room_admin_member'),
        ]

    def clean(self):
        principals = [self.student_id, self.teacher_id, self.admin_user_id]
        if sum(1 for principal in principals if principal) != 1:
            raise ValidationError('Exactly one principal (student, teacher, admin_user) must be set.')

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        if self.student_id:
            return f"{self.room} - {self.student} ({self.role})"
        if self.teacher_id:
            return f"{self.room} - {self.teacher} ({self.role})"
        return f"{self.room} - {self.admin_user} ({self.role})"


class ChatMessage(models.Model):
    SENDER_STUDENT = 'student'
    SENDER_TEACHER = 'teacher'
    SENDER_ADMIN = 'admin'
    SENDER_ROLE_CHOICES = [
        (SENDER_STUDENT, 'Student'),
        (SENDER_TEACHER, 'Teacher'),
        (SENDER_ADMIN, 'Admin'),
    ]

    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(blank=True, default='')
    sender_role = models.CharField(max_length=20, choices=SENDER_ROLE_CHOICES)
    sender_student = models.ForeignKey('students.Student', on_delete=models.SET_NULL, related_name='chat_messages', null=True, blank=True)
    sender_teacher = models.ForeignKey('teachers.Teacher', on_delete=models.SET_NULL, related_name='chat_messages', null=True, blank=True)
    sender_admin = models.ForeignKey('admin_users.AdminUser', on_delete=models.SET_NULL, related_name='chat_messages', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at', 'id']

    def clean(self):
        principals = [self.sender_student_id, self.sender_teacher_id, self.sender_admin_id]
        if sum(1 for principal in principals if principal) != 1:
            raise ValidationError('Exactly one sender principal must be set.')

        if self.sender_role == self.SENDER_STUDENT and not self.sender_student_id:
            raise ValidationError('sender_student is required when sender_role=student.')
        if self.sender_role == self.SENDER_TEACHER and not self.sender_teacher_id:
            raise ValidationError('sender_teacher is required when sender_role=teacher.')
        if self.sender_role == self.SENDER_ADMIN and not self.sender_admin_id:
            raise ValidationError('sender_admin is required when sender_role=admin.')

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.room} [{self.sender_role}] {self.created_at}"


class ChatMessageAttachment(models.Model):
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='chat_attachments/%Y/%m/%d/')
    original_name = models.CharField(max_length=255, blank=True, default='')
    mime_type = models.CharField(max_length=120, blank=True, default='')
    size = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    @property
    def is_image(self):
        return self.mime_type.startswith('image/')

    def __str__(self):
        return f"Attachment {self.id} for message {self.message_id}"
