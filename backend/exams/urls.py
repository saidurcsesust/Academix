from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ExamViewSet

router = DefaultRouter()
router.register('exams', ExamViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
