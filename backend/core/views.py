from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AcademicYear,
    Semester,
    SemesterSubject,
    Subject,
)
from .serializers import (
    AcademicYearSerializer,
    SemesterSerializer,
    SemesterSubjectSerializer,
    SubjectSerializer,
)
from admin_users.serializers import AdminUserSerializer
from admin_users.models import AdminUser
from students.serializers import StudentSerializer
from students.models import Student
from teachers.serializers import TeacherSerializer
from teachers.models import Teacher


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by('name')
    serializer_class = SubjectSerializer


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


class AcademicYearViewSet(viewsets.ModelViewSet):
    queryset = AcademicYear.objects.all().order_by('-year')
    serializer_class = AcademicYearSerializer


class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.select_related('academic_year').all().order_by('-academic_year__year', 'semester_no')
    serializer_class = SemesterSerializer


class SemesterSubjectViewSet(viewsets.ModelViewSet):
    queryset = SemesterSubject.objects.select_related('semester', 'subject').all().order_by(
        '-semester__academic_year__year',
        'semester__semester_no',
        'subject__name',
    )
    serializer_class = SemesterSubjectSerializer

