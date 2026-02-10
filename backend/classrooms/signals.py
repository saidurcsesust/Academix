from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from students.models import Student

from chats.services import sync_chat_room_from_assignment, sync_classroom_chat_members

from .models import Classroom, ClassroomSubject, Enrollment


@receiver(post_save, sender=Classroom)
def auto_enroll_students(sender, instance, **kwargs):
    matching_students = Student.objects.filter(
        class_level=instance.class_level,
        section=instance.section,
        academic_year=instance.academic_year,
    )

    for student in matching_students:
        Enrollment.objects.update_or_create(
            student=student,
            defaults={'classroom': instance},
        )

    Enrollment.objects.filter(classroom=instance).exclude(
        student__class_level=instance.class_level,
        student__section=instance.section,
        student__academic_year=instance.academic_year,
    ).delete()

    sync_classroom_chat_members(instance)


@receiver(post_save, sender=ClassroomSubject)
def ensure_chat_room_for_classroom_subject(sender, instance, **kwargs):
    sync_chat_room_from_assignment(instance)


@receiver(post_save, sender=Enrollment)
def sync_chat_members_on_enrollment_change(sender, instance, **kwargs):
    sync_classroom_chat_members(instance.classroom)


@receiver(post_delete, sender=Enrollment)
def sync_chat_members_on_enrollment_delete(sender, instance, **kwargs):
    sync_classroom_chat_members(instance.classroom)
