from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AlumniViewSet

router = DefaultRouter()
router.register('alumni', AlumniViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
