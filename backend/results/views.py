from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from classrooms.models import Enrollment
from exams.models import Exam
from students.models import Student

from .models import Result, ResultApproval
from .serializers import ResultApprovalSerializer, ResultSerializer


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.select_related('student', 'subject', 'exam').all().order_by(
        'student__roll',
        'subject__name',
    )
    serializer_class = ResultSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        student_id = self.request.query_params.get('student')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        return queryset

    def _grade_for_marks(self, marks):
        if marks >= 80:
            return 'A+', 5.0
        if marks >= 70:
            return 'A', 4.0
        if marks >= 60:
            return 'A-', 3.5
        if marks >= 50:
            return 'B', 3.0
        if marks >= 40:
            return 'C', 2.0
        if marks >= 33:
            return 'D', 1.0
        return 'F', 0.0

    @action(detail=False, methods=['get'])
    def roster(self, request):
        exam_id = request.query_params.get('exam')
        if not exam_id:
            return Response({'detail': 'exam is required.'}, status=status.HTTP_400_BAD_REQUEST)

        exam = Exam.objects.select_related('classroom_subject', 'classroom_subject__classroom', 'classroom_subject__subject').filter(id=exam_id).first()
        if not exam or not exam.classroom_subject:
            return Response({'detail': 'Exam or classroom subject not found.'}, status=status.HTTP_404_NOT_FOUND)

        enrollments = Enrollment.objects.filter(classroom_id=exam.classroom_subject.classroom_id)
        student_ids = list(enrollments.values_list('student_id', flat=True))
        students = Student.objects.filter(id__in=student_ids).order_by('roll')
        results = Result.objects.filter(exam_id=exam.id, student_id__in=student_ids)
        results_map = {result.student_id: result for result in results}

        payload = []
        for student in students:
            result = results_map.get(student.id)
            payload.append({
                'student_id': student.id,
                'student_name': student.name,
                'student_roll': student.roll,
                'result_id': result.id if result else None,
                'marks': float(result.marks) if result else None,
                'grade': result.grade if result else None,
                'point': float(result.point) if result else None,
            })
        return Response(payload)

    @action(detail=False, methods=['post'])
    def bulk(self, request):
        exam_id = request.data.get('exam')
        teacher_id = request.data.get('teacher')
        entries = request.data.get('entries', [])

        if not exam_id or not teacher_id:
            return Response({'detail': 'exam and teacher are required.'}, status=status.HTTP_400_BAD_REQUEST)

        exam = Exam.objects.select_related('classroom_subject', 'classroom_subject__teacher', 'classroom_subject__subject').filter(id=exam_id).first()
        if not exam or not exam.classroom_subject:
            return Response({'detail': 'Exam or classroom subject not found.'}, status=status.HTTP_404_NOT_FOUND)

        if exam.classroom_subject.teacher_id != int(teacher_id):
            return Response({'detail': 'Only the assigned subject teacher can submit marks.'}, status=status.HTTP_403_FORBIDDEN)

        approval = ResultApproval.objects.filter(exam_id=exam.id, teacher_id=teacher_id).first()
        if approval and approval.status == ResultApproval.STATUS_APPROVED:
            return Response({'detail': 'Results are approved and locked.'}, status=status.HTTP_403_FORBIDDEN)

        if not isinstance(entries, list):
            return Response({'detail': 'entries must be a list.'}, status=status.HTTP_400_BAD_REQUEST)

        enrollment_students = set(
            Enrollment.objects.filter(classroom_id=exam.classroom_subject.classroom_id)
            .values_list('student_id', flat=True)
        )

        updated = []
        for entry in entries:
            student_id = entry.get('student')
            marks = entry.get('marks')

            if student_id is None or marks is None:
                continue
            if int(student_id) not in enrollment_students:
                continue

            grade, point = self._grade_for_marks(float(marks))
            result, _ = Result.objects.update_or_create(
                student_id=student_id,
                subject_id=exam.classroom_subject.subject_id,
                exam_id=exam.id,
                defaults={
                    'marks': marks,
                    'grade': grade,
                    'point': point,
                },
            )
            updated.append(result.id)

        return Response({'updated': updated})


class ResultApprovalViewSet(viewsets.ModelViewSet):
    queryset = ResultApproval.objects.select_related('exam', 'teacher', 'approved_by').all().order_by('-created_at')
    serializer_class = ResultApprovalSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        exam_id = self.request.query_params.get('exam')
        teacher_id = self.request.query_params.get('teacher')
        status_value = self.request.query_params.get('status')

        if exam_id:
            queryset = queryset.filter(exam_id=exam_id)
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if status_value:
            queryset = queryset.filter(status=status_value)

        return queryset

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        approval = self.get_object()
        admin_id = request.data.get('admin')
        approval.status = ResultApproval.STATUS_APPROVED
        approval.approved_at = timezone.now()
        if admin_id:
            approval.approved_by_id = admin_id
        approval.save(update_fields=['status', 'approved_at', 'approved_by'])
        serializer = self.get_serializer(approval)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        approval = self.get_object()
        approval.status = ResultApproval.STATUS_REJECTED
        approval.approved_at = None
        approval.approved_by = None
        approval.save(update_fields=['status', 'approved_at', 'approved_by'])
        serializer = self.get_serializer(approval)
        return Response(serializer.data)
