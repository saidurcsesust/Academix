import StudentAttendance from '../Pages/StudentAttendance'
import StudentDashboard from '../Pages/StudentDashboard'
import StudentExams from '../Pages/StudentExams'
import StudentAlumni from '../Pages/Alumni'
import StudentNotices from '../Pages/StudentNotices'
import StudentResults from '../Pages/StudentResults'
import StudentRoutine from '../Pages/StudentRoutine'
import StudentFaculty from '../Pages/Faculty'
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
  }

  const activePage = pageMap[currentRoute] || pageMap['/student/dashboard']

  return <>{activePage}</>
}
