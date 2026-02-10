from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChatMessageViewSet, ChatRoomMemberViewSet, ChatRoomViewSet

router = DefaultRouter()
router.register('chat-rooms', ChatRoomViewSet)
router.register('chat-room-members', ChatRoomMemberViewSet)
router.register('chat-messages', ChatMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
