from datetime import date, timedelta
import random

from django.core.management.base import BaseCommand

from core.models import (
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


class Command(BaseCommand):
    help = 'Seed the database with dummy Academix data.'

    def handle(self, *args, **options):
        if Student.objects.exists():
            self.stdout.write(self.style.WARNING('Data already exists; skipping seed.'))
            return

        year = AcademicYear.objects.create(year='2024-2025')
        semester_1 = Semester.objects.create(academic_year=year, semester_no=1)
        semester_2 = Semester.objects.create(academic_year=year, semester_no=2)

        subjects = [
            Subject(name='Mathematics', subject_code='MATH-101'),
            Subject(name='English', subject_code='ENG-101'),
            Subject(name='Science', subject_code='SCI-101'),
            Subject(name='History', subject_code='HIS-101'),
            Subject(name='Computer', subject_code='CSE-101'),
        ]
        Subject.objects.bulk_create(subjects)
        subjects = list(Subject.objects.all())

        SemesterSubject.objects.bulk_create(
            [SemesterSubject(semester=semester_1, subject=subject) for subject in subjects]
            + [SemesterSubject(semester=semester_2, subject=subject) for subject in subjects]
        )

        students = [
            Student(name='Ariana Das', class_level='10', section='A', roll=12, password_hash='hashed'),
            Student(name='Kabir Sen', class_level='10', section='A', roll=14, password_hash='hashed'),
            Student(name='Maya Rahman', class_level='10', section='B', roll=7, password_hash='hashed'),
            Student(name='Rohan Ali', class_level='10', section='B', roll=9, password_hash='hashed'),
        ]
        Student.objects.bulk_create(students)
        students = list(Student.objects.all())

        exams = [
            Exam(semester=semester_1, exam_type=Exam.EXAM_TYPE_CLASS_TEST, exam_no=1),
            Exam(semester=semester_1, exam_type=Exam.EXAM_TYPE_CLASS_TEST, exam_no=2),
            Exam(semester=semester_1, exam_type=Exam.EXAM_TYPE_SEMESTER_FINAL, exam_no=None),
        ]
        Exam.objects.bulk_create(exams)
        exams = list(Exam.objects.all())

        results = []
        for student in students:
            for subject in subjects:
                for exam in exams:
                    marks = random.randint(40, 100)
                    results.append(
                        Result(
                            student=student,
                            subject=subject,
                            exam=exam,
                            marks=marks,
                            grade='A' if marks >= 80 else 'B',
                            point=4.0 if marks >= 80 else 3.0,
                        )
                    )
        Result.objects.bulk_create(results)

        attendance_entries = []
        for offset in range(5):
            day = date.today() - timedelta(days=offset + 1)
            for student in students:
                for subject in subjects[:3]:
                    status = random.choice(['present', 'present', 'present', 'late', 'absent'])
                    attendance_entries.append(
                        Attendance(student=student, subject=subject, date=day, status=status)
                    )
        Attendance.objects.bulk_create(attendance_entries)

        routines = []
        for day_of_week in range(5):
            routines.append(
                Routine(
                    class_level='10',
                    section='A',
                    subject=subjects[day_of_week % len(subjects)],
                    day_of_week=day_of_week,
                    start_time='09:00',
                    end_time='09:45',
                )
            )
        Routine.objects.bulk_create(routines)

        notices = [
            Notice(title='Library Week', description='Book fair and reading sessions this week in the library hall.', date=date.today()),
            Notice(title='Uniform Reminder', description='Please wear full uniform on assembly days.', date=date.today()),
            Notice(title='Parent-Teacher Meeting', description='PTM scheduled for next Saturday, 10:00 AM.', date=date.today()),
        ]
        Notice.objects.bulk_create(notices)

        self.stdout.write(self.style.SUCCESS('Seeded students, academics, exams, results, attendance, routines, and notices.'))
