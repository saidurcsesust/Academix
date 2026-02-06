from django.apps import apps
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Student


@receiver(pre_save, sender=Student)
def cache_previous_class(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        previous = Student.objects.get(pk=instance.pk)
    except Student.DoesNotExist:
        return
    instance._previous_class_level = previous.class_level
    instance._previous_section = previous.section


@receiver(post_save, sender=Student)
def sync_student_enrollment(sender, instance, **kwargs):
    Classroom = apps.get_model('classrooms', 'Classroom')
    Enrollment = apps.get_model('classrooms', 'Enrollment')

    classroom = Classroom.objects.filter(
        class_level=instance.class_level,
        section=instance.section,
        academic_year=instance.academic_year,
    ).first()

    if classroom:
        Enrollment.objects.update_or_create(
            student=instance,
            defaults={'classroom': classroom},
        )
    else:
        Enrollment.objects.filter(student=instance).delete()
