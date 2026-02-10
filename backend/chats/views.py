from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import ChatMessage, ChatMessageAttachment, ChatRoom, ChatRoomMember
from .serializers import ChatMessageSerializer, ChatRoomMemberSerializer, ChatRoomSerializer


class ChatRoomViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChatRoom.objects.select_related('classroom', 'subject', 'moderator_teacher').annotate(
        member_count=Count('members'),
    )
    serializer_class = ChatRoomSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        classroom_id = self.request.query_params.get('classroom')
        subject_id = self.request.query_params.get('subject')
        student_id = self.request.query_params.get('student')
        teacher_id = self.request.query_params.get('teacher')
        admin_id = self.request.query_params.get('admin')

        if classroom_id:
            queryset = queryset.filter(classroom_id=classroom_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if student_id:
            queryset = queryset.filter(members__student_id=student_id)
        if teacher_id:
            queryset = queryset.filter(Q(moderator_teacher_id=teacher_id) | Q(members__teacher_id=teacher_id))
        if admin_id:
            queryset = queryset.filter(members__admin_user_id=admin_id)

        return queryset.distinct()


class ChatRoomMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChatRoomMember.objects.select_related('room', 'student', 'teacher', 'admin_user')
    serializer_class = ChatRoomMemberSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        room_id = self.request.query_params.get('room')
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        return queryset


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.select_related('room', 'sender_student', 'sender_teacher', 'sender_admin')
    serializer_class = ChatMessageSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        room_id = self.request.query_params.get('room')
        after_id = self.request.query_params.get('after_id')
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        if after_id:
            try:
                queryset = queryset.filter(id__gt=int(after_id))
            except (TypeError, ValueError):
                pass
        return queryset

    def perform_create(self, serializer):
        message = serializer.save()
        for uploaded_file in self.request.FILES.getlist('attachments'):
            ChatMessageAttachment.objects.create(
                message=message,
                file=uploaded_file,
                original_name=uploaded_file.name or '',
                mime_type=getattr(uploaded_file, 'content_type', '') or '',
                size=getattr(uploaded_file, 'size', 0) or 0,
            )
