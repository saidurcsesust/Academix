# Academix Frontend

React + Vite frontend for Academix dashboards.

## Stack
- React `19`
- Vite `7`

## Prerequisites
- Node.js `18+`
- npm

## Setup
Run from the `frontend/` directory.

```bash
npm install
npm run dev
```

Frontend runs at `http://127.0.0.1:5173`.

## Backend Connection
Default API base in app code:
- `VITE_API_BASE` if provided
- otherwise `/api`

Development proxy is configured in `vite.config.js`:
- `/api` -> `http://127.0.0.1:8000`

This means local development works out of the box when backend is running on port `8000`.

## Optional Environment Variable
Create `frontend/.env` if your backend is hosted elsewhere:

```env
VITE_API_BASE=http://127.0.0.1:8000/api
```

## Available Scripts
- `npm run dev` start development server
- `npm run build` create production build
- `npm run preview` preview production build locally
- `npm run lint` run ESLint

## Main Routes
- Student: `/student/dashboard`, `/student/attendance`, `/student/exams`, `/student/results`, `/student/notices`, `/student/chat`
- Teacher: `/teacher/dashboard`, `/teacher/attendance`, `/teacher/marks`, `/teacher/chat`
- Admin: `/admin/dashboard`, `/admin/classes`, `/admin/exams`, `/admin/directory`, `/admin/approvals`, `/admin/chat`
- Login: `/login`

## Notes
- Auth state is currently stored in localStorage (`academix_session`, `academix_role`, `academix_user`).
- Role-based navigation and page guards are handled client-side in `src/App.jsx`.



# Academix Backend

Django REST API for Academix.

## Stack
- Django `6.0.1`
- Django REST Framework `3.16.1`
- SQLite (`db.sqlite3`)

## Prerequisites
- Python `3.12+`

## Setup
Run from the `backend/` directory.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

## Optional Seed Data
```bash
python manage.py seed_data
```

Seed command adds demo students, teachers, classes, exams, notices, attendance, and results.

## Demo Credentials
- Admin: `admin@academix.com` / `admin123`
- Teacher: `teacher1@academix.com` / `academix123`
- Student: roll `1` / `academix123`

## API Base
- `http://127.0.0.1:8000/api/`

## API Route Groups
- Auth and academic metadata
- `POST /api/login/`
- `GET|POST /api/subjects/`
- `GET|POST /api/academic-years/`
- `GET|POST /api/semesters/`
- `GET|POST /api/semester-subjects/`

- User and directory
- `GET|POST /api/students/`
- `POST /api/create-student/`
- `GET|POST /api/teachers/`
- `POST /api/create-teacher/`
- `GET|POST /api/admins/`
- `GET|POST /api/faculty/`
- `GET|POST /api/alumni/`

- Academics and operations
- `GET|POST /api/classrooms/`
- `GET|POST /api/classroom-subjects/`
- `GET|POST /api/enrollments/`
- `GET|POST /api/routines/`
- `GET|POST /api/exams/`
- `GET|POST /api/notices/`
- `GET|POST /api/attendance/`
- `GET|POST /api/class-attendance/`
- `GET|POST /api/results/`
- `GET|POST /api/result-approvals/`

- Chat
- `GET|POST /api/chat-rooms/`
- `GET|POST /api/chat-room-members/`
- `GET|POST /api/chat-messages/`

## Useful Commands
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py test
```

## Project Layout
- `academix_backend/` project settings and root URL config
- `core/` login and shared academic models
- `students/`, `teachers/`, `admin_users/` user roles
- `classrooms/`, `routines/`, `exams/`, `attendance/`, `results/` academic features
- `notices/`, `faculty/`, `alumni/`, `chats/` supporting features

## Notes
- Media files are served from `backend/media/` during development.
- Current login logic is for local/demo usage and should be hardened before production.



