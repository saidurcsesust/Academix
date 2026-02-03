from rest_framework import viewsets

from .models import (
    AcademicYear,
    Attendance,
    Exam,
    Notice,
    Result,
    Routine,
    Semester,
    SemesterSubject,
    Student,
    Subject,
)
from .serializers import (
    AcademicYearSerializer,
    AttendanceSerializer,
    ExamSerializer,
    NoticeSerializer,
    ResultSerializer,
    RoutineSerializer,
    SemesterSerializer,
    SemesterSubjectSerializer,
    StudentSerializer,
    SubjectSerializer,
)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('roll')
    serializer_class = StudentSerializer


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by('name')
    serializer_class = SubjectSerializer


class AcademicYearViewSet(viewsets.ModelViewSet):
    queryset = AcademicYear.objects.all().order_by('-year')
    serializer_class = AcademicYearSerializer


class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.select_related('academic_year').all().order_by('-academic_year__year', 'semester_no')
    serializer_class = SemesterSerializer


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.select_related('semester', 'semester__academic_year').all().order_by(
        '-semester__academic_year__year',
        'semester__semester_no',
        'exam_type',
        'exam_no',
    )
    serializer_class = ExamSerializer


class SemesterSubjectViewSet(viewsets.ModelViewSet):
    queryset = SemesterSubject.objects.select_related('semester', 'subject').all().order_by(
        '-semester__academic_year__year',
        'semester__semester_no',
        'subject__name',
    )
    serializer_class = SemesterSubjectSerializer


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.select_related('student', 'subject', 'exam').all().order_by(
        'student__roll',
        'subject__name',
    )
    serializer_class = ResultSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('student', 'subject').all().order_by('-date')
    serializer_class = AttendanceSerializer


class RoutineViewSet(viewsets.ModelViewSet):
    queryset = Routine.objects.select_related('subject').all().order_by('class_level', 'section', 'day_of_week', 'start_time')
    serializer_class = RoutineSerializer


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all().order_by('-date')
    serializer_class = NoticeSerializer
