from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AttendanceViewSet, ExamViewSet, NoticeViewSet, StudentViewSet

router = DefaultRouter()
router.register('students', StudentViewSet)
router.register('exams', ExamViewSet)
router.register('attendance', AttendanceViewSet)
router.register('notices', NoticeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
