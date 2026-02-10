from rest_framework import serializers

from .models import ChatMessage, ChatMessageAttachment, ChatRoom, ChatRoomMember


class ChatMessageAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    is_image = serializers.BooleanField(read_only=True)

    class Meta:
        model = ChatMessageAttachment
        fields = ['id', 'file', 'file_url', 'original_name', 'mime_type', 'size', 'is_image', 'created_at']
        read_only_fields = ['id', 'file_url', 'original_name', 'mime_type', 'size', 'is_image', 'created_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        url = obj.file.url if obj.file else ''
        return request.build_absolute_uri(url) if request and url else url


class ChatRoomSerializer(serializers.ModelSerializer):
    classroom_label = serializers.CharField(source='classroom.__str__', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    moderator_teacher_name = serializers.CharField(source='moderator_teacher.name', read_only=True)
    member_count = serializers.IntegerField(source='members.count', read_only=True)

    class Meta:
        model = ChatRoom
        fields = [
            'id',
            'room_code',
            'name',
            'classroom_subject',
            'classroom',
            'classroom_label',
            'subject',
            'subject_name',
            'moderator_teacher',
            'moderator_teacher_name',
            'created_by_admin',
            'is_active',
            'member_count',
            'created_at',
        ]
        read_only_fields = [
            'classroom_subject',
            'classroom',
            'subject',
            'moderator_teacher',
            'created_by_admin',
            'member_count',
            'created_at',
        ]


class ChatRoomMemberSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)
    admin_name = serializers.CharField(source='admin_user.name', read_only=True)

    class Meta:
        model = ChatRoomMember
        fields = [
            'id',
            'room',
            'role',
            'student',
            'student_name',
            'teacher',
            'teacher_name',
            'admin_user',
            'admin_name',
            'joined_at',
        ]


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    attachments = ChatMessageAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'room',
            'content',
            'sender_role',
            'sender_student',
            'sender_teacher',
            'sender_admin',
            'sender_name',
            'attachments',
            'created_at',
        ]

    def get_sender_name(self, obj):
        if obj.sender_student_id:
            return obj.sender_student.name
        if obj.sender_teacher_id:
            return obj.sender_teacher.name
        if obj.sender_admin_id:
            return obj.sender_admin.name
        return 'Unknown'
