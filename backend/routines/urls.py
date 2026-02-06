from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import RoutineViewSet

router = DefaultRouter()
router.register('routines', RoutineViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
