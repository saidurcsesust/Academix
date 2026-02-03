import StudentAttendance from '../Pages/StudentAttendance'
import StudentDashboard from '../Pages/StudentDashboard'
import StudentExams from '../Pages/StudentExams'
import StudentAlumni from '../Pages/Alumni'
import StudentNotices from '../Pages/StudentNotices'
import StudentResults from '../Pages/StudentResults'
import StudentRoutine from '../Pages/StudentRoutine'
import StudentFaculty from '../Pages/Faculty'
import Login from '../Pages/Login'
import AdminDashboard from '../Pages/AdminDashboard'
import AdminUsers from '../Pages/AdminUsers'
import AdminDirectory from '../Pages/AdminDirectory'
import AdminUserDetails from '../Pages/AdminUserDetails'
import { attendanceStatus } from '../utils/date'

export const navItems = [
  { label: 'Dashboard', path: '/student/dashboard' },
  { label: 'Class Routine', path: '/student/routine' },
  { label: 'Attendance', path: '/student/attendance' },
  { label: 'Upcoming Exams', path: '/student/exams' },
  { label: 'Results', path: '/student/results' },
  { label: 'Notices', path: '/student/notices' },
  { label: 'Faculty', path: '/student/faculty' },
  { label: 'Alumni', path: '/student/alumni' },
]

export const adminNavItems = [
  { label: 'Admin Dashboard', path: '/admin/dashboard' },
  { label: 'User Management', path: '/admin/users' },
  { label: 'User Directory', path: '/admin/directory' },
]

export function AppRouter({
  attendanceStats,
  alumni,
  faculty,
  exams,
  notices,
  resultsSummary,
  resultsBySemester,
  routineItems,
  student,
  todayLabel,
  todayRoutine,
  weeklyRoutine,
  nextExam,
  weekend,
  onLogin,
  currentRoute,
  apiBase = '/api',
} = {}) {
  const pathname = window.location.pathname
  const resolvedRoute = currentRoute || (pathname === '/' ? '/student/dashboard' : pathname)

  const pageMap = {
    '/login': <Login onLogin={onLogin} apiBase={apiBase} />,
    '/student/dashboard': (
      <StudentDashboard
        todayLabel={todayLabel}
        student={student}
        attendanceStats={attendanceStats}
        attendanceStatus={attendanceStatus}
        weekend={weekend}
        todayRoutine={todayRoutine}
        notices={notices}
        nextExam={nextExam}
        exams={exams}
        results={resultsSummary}
      />
    ),
    '/student/routine': (
      <StudentRoutine routineItems={routineItems} weeklyRoutine={weeklyRoutine} />
    ),
    '/student/attendance': (
      <StudentAttendance attendanceStats={attendanceStats} />
    ),
    '/student/exams': <StudentExams exams={exams} />,
    '/student/results': <StudentResults results={resultsBySemester} />,
    '/student/notices': <StudentNotices notices={notices} />,
    '/student/faculty': <StudentFaculty faculty={faculty} />,
    '/student/alumni': <StudentAlumni alumni={alumni} />,
    '/admin/dashboard': (
      <AdminDashboard
        notices={notices}
        exams={exams}
        faculty={faculty}
        attendanceStats={attendanceStats}
        resultsSummary={resultsSummary}
      />
    ),
    '/admin/users': <AdminUsers apiBase={apiBase} />,
    '/admin/directory': <AdminDirectory apiBase={apiBase} />,
  }

  const isDetailsRoute = resolvedRoute.startsWith('/admin/directory/')
  const activePage = isDetailsRoute
    ? <AdminUserDetails apiBase={apiBase} />
    : (pageMap[resolvedRoute] || pageMap['/student/dashboard'])

  return <>{activePage}</>
}
