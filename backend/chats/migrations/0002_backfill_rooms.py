from django.db import migrations


def backfill_chat_rooms(apps, schema_editor):
    ClassroomSubject = apps.get_model('classrooms', 'ClassroomSubject')
    Enrollment = apps.get_model('classrooms', 'Enrollment')
    AdminUser = apps.get_model('admin_users', 'AdminUser')
    ChatRoom = apps.get_model('chats', 'ChatRoom')
    ChatRoomMember = apps.get_model('chats', 'ChatRoomMember')

    admin_ids = list(AdminUser.objects.values_list('id', flat=True))

    for assignment in ClassroomSubject.objects.select_related('classroom', 'subject', 'teacher'):
        room, _ = ChatRoom.objects.update_or_create(
            classroom_subject_id=assignment.id,
            defaults={
                'name': f"{assignment.classroom} • {assignment.subject.name}",
                'classroom_id': assignment.classroom_id,
                'subject_id': assignment.subject_id,
                'moderator_teacher_id': assignment.teacher_id,
            },
        )

        ChatRoomMember.objects.update_or_create(
            room_id=room.id,
            teacher_id=assignment.teacher_id,
            defaults={
                'role': 'moderator',
                'student_id': None,
                'admin_user_id': None,
            },
        )

        for admin_id in admin_ids:
            ChatRoomMember.objects.update_or_create(
                room_id=room.id,
                admin_user_id=admin_id,
                defaults={
                    'role': 'super_admin',
                    'student_id': None,
                    'teacher_id': None,
                },
            )

        student_ids = Enrollment.objects.filter(classroom_id=assignment.classroom_id).values_list('student_id', flat=True)
        for student_id in student_ids:
            ChatRoomMember.objects.update_or_create(
                room_id=room.id,
                student_id=student_id,
                defaults={
                    'role': 'member',
                    'teacher_id': None,
                    'admin_user_id': None,
                },
            )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(backfill_chat_rooms, noop),
    ]
