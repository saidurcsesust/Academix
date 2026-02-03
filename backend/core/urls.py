from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicYearViewSet,
    AttendanceViewSet,
    ExamViewSet,
    NoticeViewSet,
    ResultViewSet,
    RoutineViewSet,
    SemesterSubjectViewSet,
    SemesterViewSet,
    StudentViewSet,
    SubjectViewSet,
)

router = DefaultRouter()
router.register('students', StudentViewSet)
router.register('subjects', SubjectViewSet)
router.register('academic-years', AcademicYearViewSet)
router.register('semesters', SemesterViewSet)
router.register('exams', ExamViewSet)
router.register('semester-subjects', SemesterSubjectViewSet)
router.register('results', ResultViewSet)
router.register('attendance', AttendanceViewSet)
router.register('routines', RoutineViewSet)
router.register('notices', NoticeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
