from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ResultApprovalViewSet, ResultViewSet

router = DefaultRouter()
router.register('results', ResultViewSet)
router.register('result-approvals', ResultApprovalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
