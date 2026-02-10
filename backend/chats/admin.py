from django.contrib import admin

from .models import ChatMessage, ChatRoom, ChatRoomMember

admin.site.register(ChatRoom)
admin.site.register(ChatRoomMember)
admin.site.register(ChatMessage)
