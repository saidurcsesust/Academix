import './App.css'
import {
  attendanceStats,
  exams,
  notices,
  results,
  routineItems,
  student,
  weeklyRoutine,
} from './data/studentData'
import { buildAttendanceDays, formatDate, isWeekend } from './utils/date'
import { AppRouter, navItems } from './routers/route'
import Sidebar from './Components/Sidebar'
import Topbar from './Navbar/Topbar'

function App() {
  const today = new Date()
  const todayLabel = formatDate(today)
  const todayRoutine = isWeekend(today) ? [] : routineItems
  const calendarDays = buildAttendanceDays(today)
  const nextExam = exams[0]
  const pathname = window.location.pathname
  const currentRoute = pathname === '/' ? '/student/dashboard' : pathname
  const weekend = isWeekend(today)

  return (
    <div className="app-shell">
      <Sidebar navItems={navItems} currentRoute={currentRoute} />

      <div className="main">
        <Topbar student={student} />

        <main className="content">
          <AppRouter
            attendanceStats={attendanceStats}
            calendarDays={calendarDays}
            notices={notices}
            results={results}
            routineItems={routineItems}
            student={student}
            todayLabel={todayLabel}
            todayRoutine={todayRoutine}
            weeklyRoutine={weeklyRoutine}
            nextExam={nextExam}
            weekend={weekend}
          />
        </main>
      </div>
    </div>
  )
}

export default App
