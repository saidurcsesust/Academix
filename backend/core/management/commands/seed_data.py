from datetime import date, time, timedelta

from django.core.management.base import BaseCommand

from core.models import (
    AcademicYear,
    Semester,
    SemesterSubject,
    Subject,
)
from admin_users.models import AdminUser
from classrooms.models import Classroom, ClassroomSubject
from attendance.models import Attendance
from exams.models import Exam
from notices.models import Notice
from results.models import Result
from routines.models import Routine
from students.models import Student
from teachers.models import Teacher


class Command(BaseCommand):
    help = 'Seed the database with dummy Academix data.'

    def handle(self, *args, **options):
        if Student.objects.exists():
            self.stdout.write(self.style.WARNING('Data already exists; skipping seed.'))
            return

        year = AcademicYear.objects.create(year='2026')
        semester_1 = Semester.objects.create(academic_year=year, semester_no=1)
        semester_2 = Semester.objects.create(academic_year=year, semester_no=2)

        subjects = [
            Subject(name='Mathematics', subject_code='MATH-701'),
            Subject(name='Science', subject_code='SCI-702'),
            Subject(name='English', subject_code='ENG-703'),
            Subject(name='History', subject_code='HIS-704'),
            Subject(name='ICT', subject_code='ICT-705'),
            Subject(name='Bangla', subject_code='BAN-706'),
            Subject(name='Art', subject_code='ART-707'),
        ]
        Subject.objects.bulk_create(subjects)
        subjects = list(Subject.objects.all())

        SemesterSubject.objects.bulk_create(
            [SemesterSubject(semester=semester_1, subject=subject) for subject in subjects]
            + [SemesterSubject(semester=semester_2, subject=subject) for subject in subjects]
        )

        teacher_names = [
            'Rashed Mahmud', 'Nusrat Jahan', 'Sabbir Rahman', 'Farzana Ahmed', 'Imran Hossain',
            'Tania Sultana', 'Fahim Hasan', 'Sharmin Akter', 'Mehedi Hasan', 'Jannat Ferdous',
            'Ayesha Rahman', 'Sakib Khan', 'Mst. Rupa', 'Saifullah Noor', 'Lamia Siddique',
            'Nazmul Karim', 'Priya Das', 'Raihan Islam', 'Shila Begum', 'Aminul Haque',
        ]
        departments = ['Mathematics', 'Science', 'English', 'History', 'ICT', 'Bangla', 'Art']
        roles = ['Lecturer', 'Assistant Teacher', 'Senior Teacher']

        teachers = []
        for index in range(50):
            name = teacher_names[index % len(teacher_names)]
            teachers.append(
                Teacher(
                    name=name,
                    email=f'teacher{index + 1}@academix.com',
                    phone=f'+880 1700-10{index:03d}',
                    department=departments[index % len(departments)],
                    role=roles[index % len(roles)],
                    password_hash='academix123',
                )
            )
        Teacher.objects.bulk_create(teachers)
        teachers = list(Teacher.objects.all())

        student_first_names = [
            'Ariana', 'Samiya', 'Tahsin', 'Rafi', 'Nafisa', 'Ayaan', 'Sadia', 'Arman', 'Maliha', 'Rafid',
            'Ishraq', 'Nusaiba', 'Mahin', 'Tasmia', 'Adnan', 'Jahan', 'Faria', 'Sakib', 'Rumana', 'Arafat',
        ]
        student_last_names = [
            'Khan', 'Rahman', 'Ahmed', 'Hossain', 'Islam', 'Chowdhury', 'Sarkar', 'Das', 'Begum', 'Mia',
        ]
        class_levels = ['6', '7', '8', '9', '10']
        sections = ['A', 'B', 'C']

        students = []
        roll = 1
        for index in range(200):
            first = student_first_names[index % len(student_first_names)]
            last = student_last_names[index % len(student_last_names)]
            class_level = class_levels[index % len(class_levels)]
            section = sections[index % len(sections)]
            students.append(
                Student(
                    name=f'{first} {last}',
                    class_level=class_level,
                    section=section,
                    roll=roll,
                    password_hash='academix123',
                    academic_year=year,
                )
            )
            roll += 1
        Student.objects.bulk_create(students)
        students = list(Student.objects.all())

        AdminUser.objects.create(
            name='Admin',
            email='admin@academix.com',
            password_hash='admin123',
        )

        classrooms = []
        teacher_index = 0
        for class_level in class_levels:
            for section in sections:
                class_teacher = teachers[teacher_index % len(teachers)]
                teacher_index += 1
                classrooms.append(
                    Classroom(
                        class_level=class_level,
                        section=section,
                        academic_year=year,
                        class_teacher=class_teacher,
                    )
                )
        Classroom.objects.bulk_create(classrooms)
        classrooms = list(Classroom.objects.all())

        classroom_subjects = []
        subject_teacher_index = 0
        for classroom in classrooms:
            for subject in subjects:
                teacher = teachers[subject_teacher_index % len(teachers)]
                subject_teacher_index += 1
                classroom_subjects.append(
                    ClassroomSubject(
                        classroom=classroom,
                        subject=subject,
                        teacher=teacher,
                    )
                )
        ClassroomSubject.objects.bulk_create(classroom_subjects)
        classroom_subjects = list(ClassroomSubject.objects.all())

        subject_map_by_id = {cs.subject_id: cs for cs in classroom_subjects}
        math_subject = subjects[0]
        classroom_subject = subject_map_by_id.get(math_subject.id) or classroom_subjects[0]

        exams = [
            Exam(
                semester=semester_1,
                classroom_subject=classroom_subject,
                exam_type=Exam.EXAM_TYPE_CLASS_TEST,
                exam_no=1,
                date=date(2026, 2, 10),
                start_time=time(9, 0),
                duration_minutes=60,
            ),
            Exam(
                semester=semester_1,
                classroom_subject=classroom_subject,
                exam_type=Exam.EXAM_TYPE_CLASS_TEST,
                exam_no=2,
                date=date(2026, 2, 17),
                start_time=time(9, 0),
                duration_minutes=60,
            ),
            Exam(
                semester=semester_1,
                classroom_subject=classroom_subject,
                exam_type=Exam.EXAM_TYPE_SEMESTER_FINAL,
                exam_no=None,
                date=date(2026, 3, 3),
                start_time=time(10, 0),
                duration_minutes=120,
            ),
        ]
        Exam.objects.bulk_create(exams)
        exams = list(Exam.objects.all())

        student = students[0]
        subject_map = {subject.name: subject for subject in subjects}
        exam_map = {(exam.exam_type, exam.exam_no): exam for exam in exams}

        results = [
            Result(student=student, subject=subject_map['Mathematics'], exam=exam_map[(Exam.EXAM_TYPE_CLASS_TEST, 1)], marks=26, grade='A', point=4.0),
            Result(student=student, subject=subject_map['Science'], exam=exam_map[(Exam.EXAM_TYPE_CLASS_TEST, 1)], marks=24, grade='A', point=4.0),
            Result(student=student, subject=subject_map['English'], exam=exam_map[(Exam.EXAM_TYPE_CLASS_TEST, 1)], marks=22, grade='A', point=4.0),
            Result(student=student, subject=subject_map['History'], exam=exam_map[(Exam.EXAM_TYPE_CLASS_TEST, 1)], marks=20, grade='A', point=4.0),
            Result(student=student, subject=subject_map['Mathematics'], exam=exam_map[(Exam.EXAM_TYPE_CLASS_TEST, 2)], marks=28, grade='A', point=4.0),
            Result(student=student, subject=subject_map['Science'], exam=exam_map[(Exam.EXAM_TYPE_CLASS_TEST, 2)], marks=27, grade='A', point=4.0),
            Result(student=student, subject=subject_map['English'], exam=exam_map[(Exam.EXAM_TYPE_CLASS_TEST, 2)], marks=25, grade='A', point=4.0),
            Result(student=student, subject=subject_map['History'], exam=exam_map[(Exam.EXAM_TYPE_CLASS_TEST, 2)], marks=23, grade='A', point=4.0),
            Result(student=student, subject=subject_map['Mathematics'], exam=exam_map[(Exam.EXAM_TYPE_SEMESTER_FINAL, None)], marks=82, grade='A', point=4.0),
            Result(student=student, subject=subject_map['Science'], exam=exam_map[(Exam.EXAM_TYPE_SEMESTER_FINAL, None)], marks=79, grade='A', point=4.0),
            Result(student=student, subject=subject_map['English'], exam=exam_map[(Exam.EXAM_TYPE_SEMESTER_FINAL, None)], marks=76, grade='A', point=4.0),
            Result(student=student, subject=subject_map['History'], exam=exam_map[(Exam.EXAM_TYPE_SEMESTER_FINAL, None)], marks=72, grade='A', point=4.0),
        ]
        Result.objects.bulk_create(results)

        attendance_entries = []
        start_day = date(2026, 1, 20)
        attendance_subjects = [subject_map['Mathematics'], subject_map['Science'], subject_map['English']]
        for offset in range(5):
            day = start_day + timedelta(days=offset)
            for subject in attendance_subjects:
                status = 'present' if offset != 2 else 'late'
                attendance_entries.append(
                    Attendance(student=student, subject=subject, date=day, status=status)
                )
        Attendance.objects.bulk_create(attendance_entries)

        routines = []
        routines.extend(
            [
                Routine(
                    class_level='7',
                    section='A',
                    subject=subject_map['Mathematics'],
                    day_of_week=0,
                    start_time=time(8, 30),
                    end_time=time(9, 15),
                ),
                Routine(
                    class_level='7',
                    section='A',
                    subject=subject_map['Science'],
                    day_of_week=0,
                    start_time=time(9, 25),
                    end_time=time(10, 10),
                ),
                Routine(
                    class_level='7',
                    section='A',
                    subject=subject_map['English'],
                    day_of_week=0,
                    start_time=time(10, 20),
                    end_time=time(11, 5),
                ),
            ]
        )
        Routine.objects.bulk_create(routines)

        notices = [
            Notice(
                title='Science Fair Registration',
                description='Students participating in the science fair should form teams of 2-3 members. Submit your project title, mentor name, and required lab materials to the class teacher by 28 Jan.',
                date=date(2026, 1, 24),
            ),
            Notice(
                title='Semester Final Schedule',
                description='The semester finals will begin from 5 Feb. Please review the exam routine, arrive 20 minutes early, and bring your admit card.',
                date=date(2026, 1, 22),
            ),
            Notice(
                title='Library Day',
                description='Library day will be held this Thursday. Please return overdue books by 3 PM to avoid late fees.',
                date=date(2026, 1, 21),
            ),
        ]
        Notice.objects.bulk_create(notices)

        self.stdout.write(self.style.SUCCESS('Seeded students, academics, exams, results, attendance, routines, and notices.'))
