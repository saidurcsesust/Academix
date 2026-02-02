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
import { useEffect, useState } from 'react'
import { AppRouter, navItems } from './routers/route'
import Navbar from './Navbar/Navbar'
import Drawer from './Components/Drawer'

function App() {
  const API_BASE = import.meta.env.VITE_API_BASE || '/api'
  const today = new Date()
  const todayLabel = formatDate(today)
  const semesterKey = today.getMonth() <= 5 ? 'Jan-Jun' : 'Jul-Dec'
  const pathname = window.location.pathname
  const currentRoute = pathname === '/' ? '/student/dashboard' : pathname
  const weekend = isWeekend(today)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [studentData, setStudentData] = useState(student)
  const [examsData, setExamsData] = useState(exams)
  const [noticesData, setNoticesData] = useState(notices)
  const [attendanceData, setAttendanceData] = useState(attendanceBySemester)

  const todayRoutine = isWeekend(today) ? [] : routineItems
  const nextExam = examsData[0]
  const attendanceStats = attendanceData[semesterKey] || attendanceBySemester[semesterKey]

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  useEffect(() => {
    let ignore = false

    const formatTime = (value) => {
      if (!value) return ''
      const [hour, minute] = value.split(':').map((part) => Number(part))
      const normalizedHour = ((hour + 11) % 12) + 1
      const meridiem = hour >= 12 ? 'PM' : 'AM'
      return `${normalizedHour}:${String(minute).padStart(2, '0')} ${meridiem}`
    }

    const computeAttendanceBySemester = (records) => {
      const stats = {
        'Jan-Jun': { present: 0, absent: 0, total: 0, percent: 0 },
        'Jul-Dec': { present: 0, absent: 0, total: 0, percent: 0 },
      }

      records.forEach((record) => {
        const recordDate = new Date(record.date)
        const key = recordDate.getMonth() <= 5 ? 'Jan-Jun' : 'Jul-Dec'
        stats[key].total += 1
        if (record.status === 'present') stats[key].present += 1
        if (record.status === 'absent') stats[key].absent += 1
      })

      Object.values(stats).forEach((item) => {
        item.percent = item.total ? Math.round((item.present / item.total) * 100) : 0
      })

      return stats
    }

    const loadData = async () => {
      try {
        const [students, apiExams, apiNotices, apiAttendance] = await Promise.all([
          fetch(`${API_BASE}/students/`).then((res) => (res.ok ? res.json() : [])),
          fetch(`${API_BASE}/exams/`).then((res) => (res.ok ? res.json() : [])),
          fetch(`${API_BASE}/notices/`).then((res) => (res.ok ? res.json() : [])),
          fetch(`${API_BASE}/attendance/`).then((res) => (res.ok ? res.json() : [])),
        ])

        if (ignore) return

        if (Array.isArray(students) && students.length) {
          const [primary] = students
          setStudentData({
            name: primary.name,
            classLevel: primary.class_level,
            section: primary.section,
            roll: primary.roll,
            id: primary.id,
          })
        }

        if (Array.isArray(apiExams) && apiExams.length) {
          setExamsData(
            apiExams.map((exam) => ({
              name: exam.title,
              type: exam.title,
              code: exam.subject,
              date: formatDate(new Date(exam.date)),
              time: formatTime(exam.start_time),
              subject: exam.subject,
              syllabus: 'See syllabus',
              room: 'TBD',
              status: new Date(exam.date) >= today ? 'Upcoming' : 'Done',
            })),
          )
        }

        if (Array.isArray(apiNotices) && apiNotices.length) {
          setNoticesData(
            apiNotices.map((notice) => ({
              title: notice.title,
              date: formatDate(new Date(notice.created_at)),
              category: 'General',
              preview: notice.body.slice(0, 80),
              body: notice.body,
              attachments: [],
            })),
          )
        }

        if (Array.isArray(apiAttendance) && apiAttendance.length) {
          setAttendanceData(computeAttendanceBySemester(apiAttendance))
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to load API data', error)
        }
      }
    }

    loadData()

    return () => {
      ignore = true
    }
  }, [API_BASE, today])

  return (
    <div className="app-shell">
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        navItems={navItems}
        currentRoute={currentRoute}
        student={studentData}
      />
      <div className="main">
        <Navbar onMenuClick={handleDrawerToggle} isDrawerOpen={drawerOpen} student={studentData} />

        <main className="content">
          <AppRouter
            attendanceStats={attendanceStats}
            alumni={alumni}
            faculty={faculty}
            notices={noticesData}
            resultsSummary={resultsSummary}
            resultsBySemester={resultsBySemester}
            routineItems={routineItems}
            student={studentData}
            todayLabel={todayLabel}
            todayRoutine={todayRoutine}
            weeklyRoutine={weeklyRoutine}
            nextExam={nextExam}
            exams={examsData}
            weekend={weekend}
          />
        </main>
      </div>
    </div>
  )
}

export default App
