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
import { AppRouter, adminNavItems, navItems, teacherNavItems } from './routers/route'
import Navbar from './Navbar/Navbar'
import Drawer from './Components/Drawer'

function App() {
  const API_BASE = import.meta.env.VITE_API_BASE || '/api'
  const authStorageKey = 'academix_session'
  const roleStorageKey = 'academix_role'
  const userStorageKey = 'academix_user'
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(authStorageKey))
  const today = new Date()
  const todayLabel = formatDate(today)
  const semesterKey = today.getMonth() <= 5 ? 'Jan-Jun' : 'Jul-Dec'
  const [currentRoute, setCurrentRoute] = useState(() => {
    const pathname = window.location.pathname
    return pathname === '/' ? '/student/dashboard' : pathname
  })
  const isLoginRoute = currentRoute === '/login'
  const isAdminRoute = currentRoute.startsWith('/admin')
  const [userRole, setUserRole] = useState(() => localStorage.getItem(roleStorageKey))
  const [userProfile, setUserProfile] = useState(() => {
    const raw = localStorage.getItem(userStorageKey)
    return raw ? JSON.parse(raw) : null
  })
  const weekend = isWeekend(today)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [studentData, setStudentData] = useState(student)
  const [examsData, setExamsData] = useState(exams)
  const [noticesData, setNoticesData] = useState(notices)
  const [attendanceData, setAttendanceData] = useState(attendanceBySemester)
  const [studentAttendanceRecords, setStudentAttendanceRecords] = useState([])
  const [enrolledSubjects, setEnrolledSubjects] = useState([])
  const [studentResultsApi, setStudentResultsApi] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(authToken))
  const [isCompactNav, setIsCompactNav] = useState(() => window.innerWidth <= 980)

  const todayRoutine = isWeekend(today) ? [] : routineItems
  const nextExam = examsData[0]
  const attendanceStats = attendanceData[semesterKey] || attendanceBySemester[semesterKey]

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleLogin = (sessionToken, role, user) => {
    localStorage.setItem(authStorageKey, sessionToken)
    localStorage.setItem(roleStorageKey, role)
    setAuthToken(sessionToken)
    setUserRole(role)
    setIsAuthenticated(true)
    if (user) {
      localStorage.setItem(userStorageKey, JSON.stringify(user))
      setUserProfile(user)
      if (role === 'student') {
        setStudentData({
          name: user.name,
          classLevel: user.class_level,
          section: user.section,
          roll: user.roll,
          id: user.id,
        })
      }
    }
    const target =
      role === 'admin'
        ? '/admin/dashboard'
        : role === 'teacher'
          ? '/teacher/dashboard'
          : '/student/dashboard'
    window.history.replaceState({}, '', target)
    setCurrentRoute(target)
  }

  const handleLogout = () => {
    localStorage.removeItem(authStorageKey)
    localStorage.removeItem(roleStorageKey)
    localStorage.removeItem(userStorageKey)
    setAuthToken(null)
    setUserRole(null)
    setUserProfile(null)
    setIsAuthenticated(false)
    window.history.replaceState({}, '', '/login')
    setCurrentRoute('/login')
  }

  useEffect(() => {
    const handleResize = () => {
      setIsCompactNav(window.innerWidth <= 980)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isAuthenticated && currentRoute !== '/login') {
      window.history.replaceState({}, '', '/login')
      setCurrentRoute('/login')
    }
    if (isAuthenticated && isAdminRoute && userRole !== 'admin') {
      const target = userRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'
      window.history.replaceState({}, '', target)
      setCurrentRoute(target)
    }
    if (isAuthenticated && currentRoute.startsWith('/teacher') && userRole !== 'teacher') {
      const target = userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard'
      window.history.replaceState({}, '', target)
      setCurrentRoute(target)
    }
    if (isAuthenticated && userRole === 'teacher' && currentRoute === '/teacher/exams') {
      const target = '/teacher/dashboard'
      window.history.replaceState({}, '', target)
      setCurrentRoute(target)
    }
    if (isAuthenticated && currentRoute === '/login') {
      const target =
        userRole === 'admin'
          ? '/admin/dashboard'
          : userRole === 'teacher'
            ? '/teacher/dashboard'
            : '/student/dashboard'
      window.history.replaceState({}, '', target)
      setCurrentRoute(target)
    }
  }, [currentRoute, isAuthenticated, isAdminRoute, userRole])

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname
      setCurrentRoute(pathname === '/' ? '/student/dashboard' : pathname)
    }

    const handleDocumentClick = (event) => {
      const link = event.target.closest('a')
      if (!link) return
      if (link.target === '_blank') return
      const href = link.getAttribute('href')
      if (!href || !href.startsWith('/')) return

      event.preventDefault()
      if (href !== currentRoute) {
        window.history.pushState({}, '', href)
        setCurrentRoute(href)
      }
      setDrawerOpen(false)
    }

    window.addEventListener('popstate', handlePopState)
    document.addEventListener('click', handleDocumentClick)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [currentRoute])

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
        const authHeaders = {}
    const [students, apiExams, apiNotices] = await Promise.all([
      fetch(`${API_BASE}/students/`, { headers: authHeaders }).then((res) =>
        res.ok ? res.json() : [],
      ),
      fetch(`${API_BASE}/exams/`, { headers: authHeaders }).then((res) =>
        res.ok ? res.json() : [],
      ),
      fetch(`${API_BASE}/notices/`, { headers: authHeaders }).then((res) =>
        res.ok ? res.json() : [],
      ),
    ])

        if (ignore) return

        let attendanceRecords = []
        let studentExams = apiExams
        let subjectList = []
        let resultList = []
        const activeStudent = userRole === 'student' && userProfile ? userProfile : (Array.isArray(students) && students.length ? students[0] : null)

        if (activeStudent) {
          setStudentData({
            name: activeStudent.name,
            classLevel: activeStudent.class_level,
            section: activeStudent.section,
            roll: activeStudent.roll,
            id: activeStudent.id,
          })
          const attendanceRes = await fetch(`${API_BASE}/class-attendance/?student=${activeStudent.id}`, { headers: authHeaders })
          attendanceRecords = attendanceRes.ok ? await attendanceRes.json() : []
          const examRes = await fetch(`${API_BASE}/exams/?student=${activeStudent.id}`, { headers: authHeaders })
          studentExams = examRes.ok ? await examRes.json() : apiExams
          const enrollmentRes = await fetch(`${API_BASE}/classroom-subjects/?student=${activeStudent.id}`, { headers: authHeaders })
          const enrollmentData = enrollmentRes.ok ? await enrollmentRes.json() : []
          subjectList = Array.isArray(enrollmentData) ? enrollmentData : []
          const resultsRes = await fetch(`${API_BASE}/results/?student=${activeStudent.id}`, { headers: authHeaders })
          resultList = resultsRes.ok ? await resultsRes.json() : []
        }

        if (Array.isArray(studentExams) && studentExams.length) {
          setExamsData(
            studentExams.map((exam) => {
              const examName = exam.exam_type === 'class_test'
                ? `Class Test ${exam.exam_no || ''}`.trim()
                : 'Semester Final'
              return {
                name: examName,
                type: exam.exam_type,
                code: exam.class_label || '',
                date: formatDate(new Date(exam.date)),
                time: formatTime(exam.start_time),
                subject: exam.subject_name || 'Subject',
                syllabus: exam.syllabus || 'See syllabus',
                room: 'TBD',
                status: new Date(exam.date) >= today ? 'Upcoming' : 'Done',
              }
            }),
          )
        }

        if (Array.isArray(apiNotices) && apiNotices.length) {
          setNoticesData(
            apiNotices.map((notice) => ({
              title: notice.title,
              date: formatDate(new Date(notice.date || notice.created_at)),
              category: 'General',
              preview: (notice.description || notice.body || '').slice(0, 80),
              body: notice.description || notice.body || '',
              attachments: [],
            })),
          )
        }

        if (subjectList.length) {
          setEnrolledSubjects(subjectList)
        }

        if (Array.isArray(resultList)) {
          setStudentResultsApi(resultList)
        }

        if (Array.isArray(attendanceRecords)) {
          setStudentAttendanceRecords(attendanceRecords)
          if (attendanceRecords.length) {
            setAttendanceData(computeAttendanceBySemester(attendanceRecords))
          } else {
            setAttendanceData(attendanceBySemester)
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to load API data', error)
        }
      }
    }

    loadData()
    const intervalId = window.setInterval(loadData, 20000)

    return () => {
      ignore = true
      window.clearInterval(intervalId)
    }
  }, [API_BASE, authToken])

  if (isLoginRoute || !isAuthenticated) {
    return <AppRouter onLogin={handleLogin} apiBase={API_BASE} currentRoute={currentRoute} />
  }

  const activeNavItems = isAdminRoute
    ? adminNavItems
    : (currentRoute.startsWith('/teacher') ? teacherNavItems : navItems)
  const topNavItems = isCompactNav ? [] : activeNavItems.slice(0, 3)
  const drawerNavItems = isCompactNav ? activeNavItems : activeNavItems.slice(3)

  return (
    <div className="app-shell">
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        navItems={drawerNavItems}
        currentRoute={currentRoute}
        student={studentData}
        onLogout={handleLogout}
      />
      <div className="main">
        <Navbar
          onMenuClick={handleDrawerToggle}
          isDrawerOpen={drawerOpen}
          navItems={topNavItems}
          currentRoute={currentRoute}
        />

        <main className="content">
          <AppRouter
            attendanceStats={attendanceStats}
            attendanceRecords={studentAttendanceRecords}
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
            enrolledSubjects={enrolledSubjects}
            apiResults={studentResultsApi}
            currentRoute={currentRoute}
            userProfile={userProfile}
            apiBase={API_BASE}
          />
        </main>
      </div>
    </div>
  )
}

export default App
