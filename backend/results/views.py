from rest_framework import viewsets

from .models import Result
from .serializers import ResultSerializer


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.select_related('student', 'subject', 'exam').all().order_by(
        'student__roll',
        'subject__name',
    )
    serializer_class = ResultSerializer
