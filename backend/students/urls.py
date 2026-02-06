from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import StudentCreateView, StudentViewSet

router = DefaultRouter()
router.register('students', StudentViewSet)

urlpatterns = [
    path('create-student/', StudentCreateView.as_view()),
    path('', include(router.urls)),
]
