from datetime import date as date_type, time as time_type

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from classrooms.models import Enrollment

from .models import Attendance, ClassAttendance
from .serializers import AttendanceSerializer, ClassAttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('student', 'subject').all().order_by('-date')
    serializer_class = AttendanceSerializer


class ClassAttendanceViewSet(viewsets.ModelViewSet):
    queryset = ClassAttendance.objects.select_related('student', 'classroom').all().order_by('-date')
    serializer_class = ClassAttendanceSerializer

    def _is_after_cutoff(self, attendance_date):
        now = timezone.localtime()
        cutoff = time_type(17, 0)
        return attendance_date == now.date() and now.time() > cutoff

    def get_queryset(self):
        queryset = super().get_queryset()
        classroom_id = self.request.query_params.get('classroom')
        student_id = self.request.query_params.get('student')
        attendance_date = self.request.query_params.get('date')

        if classroom_id:
            queryset = queryset.filter(classroom_id=classroom_id)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if attendance_date:
            queryset = queryset.filter(date=attendance_date)

        return queryset

    @action(detail=False, methods=['post'])
    def initialize(self, request):
        classroom_id = request.data.get('classroom')
        attendance_date = request.data.get('date')

        if not classroom_id or not attendance_date:
            return Response({'detail': 'classroom and date are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parsed_date = date_type.fromisoformat(attendance_date)
        except ValueError:
            return Response({'detail': 'date must be in YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)

        if self._is_after_cutoff(parsed_date):
            return Response({'detail': 'Attendance editing is closed after 5:00 PM.'}, status=status.HTTP_403_FORBIDDEN)

        enrollments = Enrollment.objects.filter(classroom_id=classroom_id)
        existing = ClassAttendance.objects.filter(classroom_id=classroom_id, date=attendance_date)
        existing_students = set(existing.values_list('student_id', flat=True))

        to_create = [
            ClassAttendance(
                classroom_id=classroom_id,
                student_id=enrollment.student_id,
                date=attendance_date,
                status=ClassAttendance.STATUS_PRESENT,
            )
            for enrollment in enrollments
            if enrollment.student_id not in existing_students
        ]

        if to_create:
            ClassAttendance.objects.bulk_create(to_create)

        queryset = ClassAttendance.objects.filter(classroom_id=classroom_id, date=attendance_date)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if self._is_after_cutoff(instance.date):
            return Response({'detail': 'Attendance editing is closed after 5:00 PM.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if self._is_after_cutoff(instance.date):
            return Response({'detail': 'Attendance editing is closed after 5:00 PM.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)
