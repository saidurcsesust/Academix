from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ClassroomSubjectViewSet, ClassroomViewSet, EnrollmentViewSet

router = DefaultRouter()
router.register('classrooms', ClassroomViewSet)
router.register('classroom-subjects', ClassroomSubjectViewSet)
router.register('enrollments', EnrollmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
