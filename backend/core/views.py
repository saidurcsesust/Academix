from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

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
    Teacher,
    AdminUser,
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
    TeacherSerializer,
    AdminUserSerializer,
)




class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('roll')
    serializer_class = StudentSerializer


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by('name')
    serializer_class = SubjectSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all().order_by('name')
    serializer_class = TeacherSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        role = str(request.data.get('role', '')).strip().lower()
        identifier = str(request.data.get('identifier', '')).strip()
        password = str(request.data.get('password', '')).strip()

        if not role or not identifier or not password:
            return Response({'detail': 'Role, identifier, and password are required.'}, status=400)

        if role == 'admin':
            user = AdminUser.objects.filter(email=identifier).first()
            if not user or user.password_hash != password:
                return Response({'detail': 'Invalid credentials.'}, status=401)
            return Response({'role': 'admin', 'user': AdminUserSerializer(user).data})

        if role == 'teacher':
            user = Teacher.objects.filter(email=identifier).first()
            if not user or user.password_hash != password:
                return Response({'detail': 'Invalid credentials.'}, status=401)
            return Response({'role': 'teacher', 'user': TeacherSerializer(user).data})

        if role == 'student':
            student = Student.objects.filter(roll=identifier).first()
            if not student or student.password_hash != password:
                return Response({'detail': 'Invalid credentials.'}, status=401)
            return Response({'role': 'student', 'user': StudentSerializer(student).data})

        return Response({'detail': 'Unsupported role.'}, status=400)


class StudentCreateView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [AllowAny]


class TeacherCreateView(generics.CreateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [AllowAny]


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
