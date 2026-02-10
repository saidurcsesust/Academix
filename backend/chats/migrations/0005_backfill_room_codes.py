import uuid

from django.db import migrations


def backfill_room_codes(apps, schema_editor):
    ChatRoom = apps.get_model('chats', 'ChatRoom')

    existing_codes = set(
        code for code in ChatRoom.objects.exclude(room_code__isnull=True).values_list('room_code', flat=True)
    )

    for room in ChatRoom.objects.filter(room_code__isnull=True):
        while True:
            candidate = f"CHAT-{uuid.uuid4().hex[:8].upper()}"
            if candidate not in existing_codes:
                existing_codes.add(candidate)
                room.room_code = candidate
                room.save(update_fields=['room_code'])
                break


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0004_chatroom_room_code'),
    ]

    operations = [
        migrations.RunPython(backfill_room_codes, noop),
    ]
