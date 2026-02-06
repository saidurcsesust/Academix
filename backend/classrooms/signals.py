from django.db.models.signals import post_save
from django.dispatch import receiver

from students.models import Student

from .models import Classroom, Enrollment


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
