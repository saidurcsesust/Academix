from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicYearViewSet,
    LoginView,
    SemesterSubjectViewSet,
    SemesterViewSet,
    SubjectViewSet,
)

router = DefaultRouter()
router.register('subjects', SubjectViewSet)
router.register('academic-years', AcademicYearViewSet)
router.register('semesters', SemesterViewSet)
router.register('semester-subjects', SemesterSubjectViewSet)

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('', include(router.urls)),
]
