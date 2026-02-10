from django.db.models.signals import post_save
from django.dispatch import receiver

from admin_users.models import AdminUser

from .services import sync_admin_memberships_for_new_admin


@receiver(post_save, sender=AdminUser)
def add_admin_to_all_chat_rooms(sender, instance, created, **kwargs):
    if not created:
        return
    sync_admin_memberships_for_new_admin(instance)
