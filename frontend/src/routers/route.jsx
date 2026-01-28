import StudentAttendance from '../Pages/StudentAttendance'
import StudentDashboard from '../Pages/StudentDashboard'
import StudentNotices from '../Pages/StudentNotices'
import StudentResults from '../Pages/StudentResults'
import StudentRoutine from '../Pages/StudentRoutine'
import { attendanceStatus } from '../utils/date'

export const navItems = [
  { label: 'Dashboard', path: '/student/dashboard' },
  { label: 'Class Routine', path: '/student/routine' },
  { label: 'Attendance', path: '/student/attendance' },
  { label: 'Results', path: '/student/results' },
  { label: 'Notices', path: '/student/notices' },
]

export function AppRouter({
  attendanceStats,
  calendarDays,
  notices,
  results,
  routineItems,
  student,
  todayLabel,
  todayRoutine,
  weeklyRoutine,
  nextExam,
  weekend,
}) {
  const pathname = window.location.pathname
  const currentRoute = pathname === '/' ? '/student/dashboard' : pathname

  const pageMap = {
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
        results={results}
      />
    ),
    '/student/attendance': (
      <StudentAttendance attendanceStats={attendanceStats} calendarDays={calendarDays} />
    ),
    '/student/routine': (
      <StudentRoutine routineItems={routineItems} weeklyRoutine={weeklyRoutine} />
    ),
    '/student/notices': <StudentNotices notices={notices} />,
    '/student/results': <StudentResults results={results} />,
  }

  const activePage = pageMap[currentRoute] || pageMap['/student/dashboard']

  return <>{activePage}</>
}
