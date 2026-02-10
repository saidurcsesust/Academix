import { useEffect, useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function TeacherDashboard({
  apiBase = '/api',
  userProfile,
  notices = [],
  todayLabel,
}) {
  const [teacher, setTeacher] = useState(userProfile || null)
  const [assignments, setAssignments] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [teacherExams, setTeacherExams] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    const loadTeacherData = async () => {
      try {
        const [teachersRes, assignmentsRes, classroomsRes] = await Promise.all([
          fetch(`${apiBase}/teachers/`),
          fetch(`${apiBase}/classroom-subjects/`),
          fetch(`${apiBase}/classrooms/`),
        ])

        const [teachersData, assignmentsData, classroomsData] = await Promise.all([
          teachersRes.ok ? teachersRes.json() : [],
          assignmentsRes.ok ? assignmentsRes.json() : [],
          classroomsRes.ok ? classroomsRes.json() : [],
        ])

        if (ignore) return

        const teacherList = Array.isArray(teachersData) ? teachersData : []
        const fallbackTeacher = teacherList[0] || null
        const currentTeacher = userProfile || teacher || fallbackTeacher
        setTeacher((prev) => prev || fallbackTeacher)
        const normalizedAssignments = Array.isArray(assignmentsData) ? assignmentsData : []
        setAssignments(normalizedAssignments)
        setClassrooms(Array.isArray(classroomsData) ? classroomsData : [])

        if (currentTeacher?.id) {
          const examsRes = await fetch(`${apiBase}/exams/?teacher=${currentTeacher.id}`)
          const examsData = examsRes.ok ? await examsRes.json() : []
          setTeacherExams(Array.isArray(examsData) ? examsData : [])
        } else {
          setTeacherExams([])
        }
        setStatus('ready')
      } catch (error) {
        if (!ignore) setStatus('error')
      }
    }

    loadTeacherData()
    const intervalId = window.setInterval(loadTeacherData, 20000)

    return () => {
      ignore = true
      window.clearInterval(intervalId)
    }
  }, [apiBase, userProfile])

  const teacherId = teacher?.id

  const myAssignments = useMemo(() => {
    if (!teacherId) return []
    return assignments.filter((assignment) => Number(assignment.teacher) === Number(teacherId))
  }, [assignments, teacherId])

  const myClassroomIds = useMemo(() => {
    const ids = new Set()
    myAssignments.forEach((assignment) => ids.add(assignment.classroom))
    classrooms.forEach((classroom) => {
      if (Number(classroom.class_teacher) === Number(teacherId)) {
        ids.add(classroom.id)
      }
    })
    return Array.from(ids)
  }, [myAssignments, classrooms, teacherId])

  const myClassrooms = useMemo(() => (
    classrooms.filter((classroom) => myClassroomIds.includes(classroom.id))
  ), [classrooms, myClassroomIds])
  const homeroomClassroomIds = useMemo(() => (
    new Set(
      classrooms
        .filter((classroom) => Number(classroom.class_teacher) === Number(teacherId))
        .map((classroom) => classroom.id),
    )
  ), [classrooms, teacherId])

  const statCards = [
    { label: 'Subjects', value: myAssignments.length },
    { label: 'Classes', value: myClassrooms.length },
    {
      label: 'Homerooms',
      value: classrooms.filter((classroom) => Number(classroom.class_teacher) === Number(teacherId)).length,
    },
    { label: 'Upcoming Exams', value: teacherExams.length },
  ]

  const upcomingTeacherExams = useMemo(() => (
    [...teacherExams]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6)
  ), [teacherExams])
  const latestNotice = notices.length ? notices[0] : null

  return (
    <section className="page" id="teacher-dashboard">
      <PageHeader
        title="Teacher Dashboard"
        subtitle={`${todayLabel}`}
        actions={latestNotice ? (
          <div className="notice-marquee-wrap">
            <div className="notice-marquee" aria-label="Latest notice">
              <span className="notice-marquee-track" aria-live="polite">
                <span className="notice-marquee-text">
                  {latestNotice.title} — {latestNotice.preview}
                </span>
              </span>
            </div>
          </div>
        ) : null}
      />

      <div className="teacher-top-row">
        <Card className="admin-panel teacher-profile-card">
          {status === 'error' ? (
            <p className="card-note">Failed to load teacher profile.</p>
          ) : (
            <div className="admin-details">
              <b>{teacher?.name || '—'}</b>
              <p>{teacher?.role || '—'}</p>
              <p>{teacher?.department || '—'}</p>
              <p>{teacher?.email || '—'}</p>
            </div>
          )}
        </Card>

        <Card className="admin-panel teacher-stat-card">
          <CardHeader>
            <div>
              <h2>Quick Overview</h2>
              <p className="card-note">Live summary of your teaching scope.</p>
            </div>
          </CardHeader>
          <div className="teacher-stat-grid">
            {statCards.map((card) => (
              <div className="teacher-stat-tile" key={card.label}>
                <p className="teacher-stat-label">{card.label}</p>
                <p className="teacher-stat-value">{card.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid-2 admin-grid" style={{ marginTop: '24px' }}>
        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Assigned Subjects</h2>
            </div>
          </CardHeader>
          {status === 'error' ? (
            <p className="card-note">Failed to load subject assignments.</p>
          ) : (
            <table className="routine-table admin-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                </tr>
              </thead>
              <tbody>
                {myAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className={homeroomClassroomIds.has(assignment.classroom) ? 'class-teacher-subject-row' : ''}
                  >
                    <td>{assignment.classroom_label}</td>
                    <td>
                      <div className="subject-cell">
                        <span className="subject-cell-text">{assignment.subject_name}</span>
                        {homeroomClassroomIds.has(assignment.classroom) ? (
                          <span className="ct-tag" title="Class Teacher">CT</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <div className="grid-2 admin-grid" style={{ marginTop: '24px' }}>
        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>My Upcoming Exams</h2>
              <p className="card-note">Exams created by admin for your assigned subjects.</p>
            </div>
          </CardHeader>
          {status === 'error' ? (
            <p className="card-note">Failed to load exams.</p>
          ) : upcomingTeacherExams.length === 0 ? (
            <p className="empty-state">No upcoming exams assigned yet.</p>
          ) : (
            <table className="routine-table admin-table">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTeacherExams.map((exam) => (
                  <tr key={exam.id}>
                    <td>
                      {exam.exam_type === 'class_test'
                        ? `Class Test ${exam.exam_no || ''}`.trim()
                        : 'Semester Final'}
                    </td>
                    <td>{exam.subject_name || '—'}</td>
                    <td>{exam.class_label || '—'}</td>
                    <td>{exam.date || '—'}</td>
                    <td>{exam.start_time || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </section>
  )
}
