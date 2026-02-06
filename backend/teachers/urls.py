from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TeacherCreateView, TeacherViewSet

router = DefaultRouter()
router.register('teachers', TeacherViewSet)

urlpatterns = [
    path('create-teacher/', TeacherCreateView.as_view()),
    path('', include(router.urls)),
]
