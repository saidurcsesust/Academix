import './styles/index.css'
import {
  alumni,
  attendanceBySemester,
  exams,
  faculty,
  notices,
  resultsBySemester,
  resultsSummary,
  routineItems,
  student,
  weeklyRoutine,
} from './data/studentData'
import { formatDate, isWeekend } from './utils/date'
import { AppRouter, navItems } from './routers/route'
import Navbar from './Navbar/Navbar'
import Sidebar from './Components/Sidebar'

function App() {
  const today = new Date()
  const todayLabel = formatDate(today)
  const todayRoutine = isWeekend(today) ? [] : routineItems
  const nextExam = exams[0]
  const semesterKey = today.getMonth() <= 5 ? 'Jan-Jun' : 'Jul-Dec'
  const attendanceStats = attendanceBySemester[semesterKey]
  const pathname = window.location.pathname
  const currentRoute = pathname === '/' ? '/student/dashboard' : pathname
  const weekend = isWeekend(today)

  return (
    <div className="app-shell">
      <Sidebar navItems={navItems} currentRoute={currentRoute} student={student} />
      <div className="main">
        <Navbar />

        <main className="content">
          <AppRouter
            attendanceStats={attendanceStats}
            alumni={alumni}
            faculty={faculty}
            notices={notices}
            resultsSummary={resultsSummary}
            resultsBySemester={resultsBySemester}
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
