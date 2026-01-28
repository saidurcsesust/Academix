import './styles/index.css'
import {
  alumni,
  attendanceBySemester,
  exams,
  faculty,
  notices,
  results,
  routineItems,
  student,
  weeklyRoutine,
} from './data/studentData'
import { buildAttendanceDays, formatDate, isWeekend } from './utils/date'
import { AppRouter, navItems } from './routers/route'
import Navbar from './Navbar/Navbar'

function App() {
  const today = new Date()
  const todayLabel = formatDate(today)
  const todayRoutine = isWeekend(today) ? [] : routineItems
  const calendarDays = buildAttendanceDays(today)
  const nextExam = exams[0]
  const semesterKey = today.getMonth() <= 5 ? 'Jan-Jun' : 'Jul-Dec'
  const attendanceStats = attendanceBySemester[semesterKey]
  const pathname = window.location.pathname
  const currentRoute = pathname === '/' ? '/student/dashboard' : pathname
  const weekend = isWeekend(today)

  return (
    <div className="app-shell">
      <div className="main">
        <Navbar
          navItems={navItems}
          currentRoute={currentRoute}
          student={student}
        />

        <main className="content">
          <AppRouter
            attendanceStats={attendanceStats}
            calendarDays={calendarDays}
            alumni={alumni}
            faculty={faculty}
            notices={notices}
            results={results}
            routineItems={routineItems}
            student={student}
            todayLabel={todayLabel}
            todayRoutine={todayRoutine}
            weeklyRoutine={weeklyRoutine}
            nextExam={nextExam}
            exams={exams}
            weekend={weekend}
          />
        </main>
      </div>
    </div>
  )
}

export default App
