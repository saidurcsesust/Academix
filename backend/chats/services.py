from admin_users.models import AdminUser
from classrooms.models import Enrollment

from .models import ChatRoom, ChatRoomMember


def _room_name(classroom_subject):
    return f"{classroom_subject.classroom} • {classroom_subject.subject.name}"


def sync_chat_room_from_assignment(classroom_subject):
    room, _ = ChatRoom.objects.update_or_create(
        classroom_subject=classroom_subject,
        defaults={
            'name': _room_name(classroom_subject),
            'classroom': classroom_subject.classroom,
            'subject': classroom_subject.subject,
            'moderator_teacher': classroom_subject.teacher,
        },
    )

    # Ensure assigned subject teacher is moderator.
    ChatRoomMember.objects.update_or_create(
        room=room,
        teacher=classroom_subject.teacher,
        defaults={
            'role': ChatRoomMember.ROLE_MODERATOR,
            'student': None,
            'admin_user': None,
        },
    )

    # Remove stale moderators for this room.
    ChatRoomMember.objects.filter(room=room, role=ChatRoomMember.ROLE_MODERATOR).exclude(
        teacher=classroom_subject.teacher,
    ).delete()

    _sync_super_admins(room)
    _sync_students(room)
    return room


def sync_classroom_chat_members(classroom):
    rooms = ChatRoom.objects.filter(classroom=classroom).select_related('classroom_subject')
    for room in rooms:
        _sync_students(room)


def sync_admin_memberships_for_new_admin(admin_user):
    for room in ChatRoom.objects.all():
        ChatRoomMember.objects.update_or_create(
            room=room,
            admin_user=admin_user,
            defaults={
                'role': ChatRoomMember.ROLE_SUPER_ADMIN,
                'student': None,
                'teacher': None,
            },
        )


def _sync_super_admins(room):
    admin_ids = set(AdminUser.objects.values_list('id', flat=True))
    if admin_ids:
        for admin_id in admin_ids:
            ChatRoomMember.objects.update_or_create(
                room=room,
                admin_user_id=admin_id,
                defaults={
                    'role': ChatRoomMember.ROLE_SUPER_ADMIN,
                    'student': None,
                    'teacher': None,
                },
            )

    ChatRoomMember.objects.filter(room=room, admin_user__isnull=False).exclude(admin_user_id__in=admin_ids).delete()


def _sync_students(room):
    student_ids = set(
        Enrollment.objects.filter(classroom=room.classroom).values_list('student_id', flat=True)
    )

    for student_id in student_ids:
        ChatRoomMember.objects.update_or_create(
            room=room,
            student_id=student_id,
            defaults={
                'role': ChatRoomMember.ROLE_MEMBER,
                'teacher': None,
                'admin_user': None,
            },
        )

    ChatRoomMember.objects.filter(room=room, student__isnull=False).exclude(student_id__in=student_ids).delete()
