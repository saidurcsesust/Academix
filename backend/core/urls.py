from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicYearViewSet,
    AttendanceViewSet,
    ExamViewSet,
    LoginView,
    NoticeViewSet,
    ResultViewSet,
    RoutineViewSet,
    SemesterSubjectViewSet,
    SemesterViewSet,
    StudentCreateView,
    StudentViewSet,
    SubjectViewSet,
    TeacherCreateView,
    TeacherViewSet,
)

router = DefaultRouter()
router.register('students', StudentViewSet)
router.register('subjects', SubjectViewSet)
router.register('teachers', TeacherViewSet)
router.register('academic-years', AcademicYearViewSet)
router.register('semesters', SemesterViewSet)
router.register('exams', ExamViewSet)
router.register('semester-subjects', SemesterSubjectViewSet)
router.register('results', ResultViewSet)
router.register('attendance', AttendanceViewSet)
router.register('routines', RoutineViewSet)
router.register('notices', NoticeViewSet)

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('create-student/', StudentCreateView.as_view()),
    path('create-teacher/', TeacherCreateView.as_view()),
    path('', include(router.urls)),
]
