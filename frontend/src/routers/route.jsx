import StudentAttendance from '../Pages/StudentAttendance'
import StudentDashboard from '../Pages/StudentDashboard'
import StudentExams from '../Pages/StudentExams'
import StudentAlumni from '../Pages/StudentAlumni'
import StudentNotices from '../Pages/StudentNotices'
import StudentResults from '../Pages/StudentResults'
import StudentRoutine from '../Pages/StudentRoutine'
import StudentFaculty from '../Pages/StudentFaculty'
import { attendanceStatus } from '../utils/date'

export const navItems = [
  { label: 'Dashboard', path: '/student/dashboard' },
  { label: 'Class Routine', path: '/student/routine' },
  { label: 'Attendance', path: '/student/attendance' },
  { label: 'Upcoming Exams', path: '/student/exams' },
  { label: 'Alumni', path: '/student/alumni' },
  { label: 'Faculty', path: '/student/faculty' },
  { label: 'Results', path: '/student/results' },
  { label: 'Notices', path: '/student/notices' },
]

export function AppRouter({
  attendanceStats,
  calendarDays,
  alumni,
  faculty,
  exams,
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
        exams={exams}
        results={results}
      />
    ),
    '/student/attendance': (
      <StudentAttendance attendanceStats={attendanceStats} calendarDays={calendarDays} />
    ),
    '/student/routine': (
      <StudentRoutine routineItems={routineItems} weeklyRoutine={weeklyRoutine} />
    ),
    '/student/exams': <StudentExams exams={exams} />,
    '/student/alumni': <StudentAlumni alumni={alumni} />,
    '/student/faculty': <StudentFaculty faculty={faculty} />,
    '/student/notices': <StudentNotices notices={notices} />,
    '/student/results': <StudentResults results={results} />,
  }

  const activePage = pageMap[currentRoute] || pageMap['/student/dashboard']

  return <>{activePage}</>
}
