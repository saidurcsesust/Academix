from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AttendanceViewSet, ClassAttendanceViewSet

router = DefaultRouter()
router.register('attendance', AttendanceViewSet)
router.register('class-attendance', ClassAttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
