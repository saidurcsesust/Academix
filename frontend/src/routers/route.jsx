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
import AdminDirectoryList from '../Pages/AdminDirectoryList'
import AdminUserDetails from '../Pages/AdminUserDetails'
import AdminClasses from '../Pages/AdminClasses'
import AdminClassCreate from '../Pages/AdminClassCreate'
import AdminAssignSubject from '../Pages/AdminAssignSubject'
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
  { label: 'Class Management', path: '/admin/classes' },
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
    '/admin/classes': <AdminClasses apiBase={apiBase} />,
    '/admin/classes/new': <AdminClassCreate apiBase={apiBase} />,
    '/admin/classes/assign': <AdminAssignSubject apiBase={apiBase} />,
  }

  const directoryParts = resolvedRoute.split('/').filter(Boolean)
  const isDirectoryRoute = directoryParts[0] === 'admin' && directoryParts[1] === 'directory'
  const directoryRole = directoryParts[2]
  const directoryId = directoryParts[3]
  const isDirectoryList = isDirectoryRoute && (directoryRole === 'students' || directoryRole === 'teachers') && !directoryId
  const isDirectoryDetails = isDirectoryRoute && (directoryRole === 'students' || directoryRole === 'teachers') && directoryId

  let activePage = pageMap[resolvedRoute] || pageMap['/student/dashboard']
  if (isDirectoryList) {
    activePage = <AdminDirectoryList apiBase={apiBase} />
  } else if (isDirectoryDetails) {
    activePage = <AdminUserDetails apiBase={apiBase} />
  }

  return <>{activePage}</>
}
