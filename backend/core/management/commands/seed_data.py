from datetime import date, time, timedelta
import random

from django.core.management.base import BaseCommand

from core.models import Attendance, Exam, Notice, Student


class Command(BaseCommand):
    help = 'Seed the database with dummy Academix data.'

    def handle(self, *args, **options):
        if Student.objects.exists():
            self.stdout.write(self.style.WARNING('Data already exists; skipping seed.'))
            return

        students = [
            Student(name='Ariana Das', class_level='10', section='A', roll=12, email='ariana@example.com'),
            Student(name='Kabir Sen', class_level='10', section='A', roll=14, email='kabir@example.com'),
            Student(name='Maya Rahman', class_level='10', section='B', roll=7, email='maya@example.com'),
            Student(name='Rohan Ali', class_level='10', section='B', roll=9, email='rohan@example.com'),
        ]
        Student.objects.bulk_create(students)
        students = list(Student.objects.all())

        exams = [
            Exam(title='Midterm', subject='Mathematics', date=date.today() + timedelta(days=7), start_time=time(9, 0)),
            Exam(title='Midterm', subject='English', date=date.today() + timedelta(days=9), start_time=time(11, 0)),
            Exam(title='Midterm', subject='Science', date=date.today() + timedelta(days=11), start_time=time(10, 0)),
            Exam(title='Quiz', subject='History', date=date.today() + timedelta(days=4), start_time=time(14, 0), duration_minutes=45),
        ]
        Exam.objects.bulk_create(exams)

        notices = [
            Notice(title='Library Week', body='Book fair and reading sessions this week in the library hall.'),
            Notice(title='Uniform Reminder', body='Please wear full uniform on assembly days.'),
            Notice(title='Parent-Teacher Meeting', body='PTM scheduled for next Saturday, 10:00 AM.'),
        ]
        Notice.objects.bulk_create(notices)

        attendance_entries = []
        for offset in range(5):
            day = date.today() - timedelta(days=offset + 1)
            for student in students:
                status = random.choice(['present', 'present', 'present', 'late', 'absent'])
                attendance_entries.append(
                    Attendance(student=student, date=day, status=status)
                )
        Attendance.objects.bulk_create(attendance_entries)

        self.stdout.write(self.style.SUCCESS('Seeded students, exams, notices, and attendance.'))
