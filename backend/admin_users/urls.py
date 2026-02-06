from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminUserViewSet

router = DefaultRouter()
router.register('admins', AdminUserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
