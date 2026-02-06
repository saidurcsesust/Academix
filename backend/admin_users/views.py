from rest_framework import viewsets

from .models import AdminUser

from .serializers import AdminUserSerializer


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = AdminUser.objects.all().order_by('name')
    serializer_class = AdminUserSerializer
