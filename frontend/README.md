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
