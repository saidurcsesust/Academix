# Academix Backend

Django REST API for the Academix app. Provides CRUD endpoints for students, exams, attendance, and notices.

## Tech Stack
- Django 6.0.1
- Django REST Framework 3.16.1
- SQLite (default, `db.sqlite3`)

## Project Structure
- `academix_backend/` - Django project settings and root URLs
- `core/` - Main app (models, serializers, viewsets, API routes)
- `manage.py` - Django CLI entry point

## Setup
1) Create and activate a virtual environment
2) Install dependencies
3) Run migrations
4) Start the server

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`.

## API Endpoints
All endpoints are exposed via DRF viewsets under `/api/`.

- `GET /api/students/`
- `POST /api/students/`
- `GET /api/students/{id}/`
- `PATCH /api/students/{id}/`
- `DELETE /api/students/{id}/`

- `GET /api/exams/`
- `POST /api/exams/`
- `GET /api/exams/{id}/`
- `PATCH /api/exams/{id}/`
- `DELETE /api/exams/{id}/`

- `GET /api/attendance/`
- `POST /api/attendance/`
- `GET /api/attendance/{id}/`
- `PATCH /api/attendance/{id}/`
- `DELETE /api/attendance/{id}/`

- `GET /api/notices/`
- `POST /api/notices/`
- `GET /api/notices/{id}/`
- `PATCH /api/notices/{id}/`
- `DELETE /api/notices/{id}/`

## Models
- Student: name, class_level, section, roll, email
- Exam: title, subject, date, start_time, duration_minutes
- Attendance: student (FK), date, status, notes (unique per student/date)
- Notice: title, body, created_at

## Admin
The Django admin is available at `http://127.0.0.1:8000/admin/`.
Create a superuser with:

```bash
python manage.py createsuperuser
```
