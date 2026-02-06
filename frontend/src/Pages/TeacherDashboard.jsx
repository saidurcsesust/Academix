import { useEffect, useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function TeacherDashboard({ apiBase = '/api', userProfile }) {
  const [teacher, setTeacher] = useState(userProfile || null)
  const [assignments, setAssignments] = useState([])
  const [classrooms, setClassrooms] = useState([])
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
        setTeacher((prev) => prev || fallbackTeacher)
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : [])
        setClassrooms(Array.isArray(classroomsData) ? classroomsData : [])
        setStatus('ready')
      } catch (error) {
        if (!ignore) setStatus('error')
      }
    }

    loadTeacherData()

    return () => {
      ignore = true
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

  const statCards = [
    { label: 'Subjects', value: myAssignments.length },
    { label: 'Classes', value: myClassrooms.length },
    {
      label: 'Homerooms',
      value: classrooms.filter((classroom) => Number(classroom.class_teacher) === Number(teacherId)).length,
    },
  ]

  return (
    <section className="page" id="teacher-dashboard">
      <PageHeader
        title="Teacher Dashboard"
        subtitle="Track your classes, subjects, and homeroom responsibilities."
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

        <div className="teacher-stat-row">
          <p className="teacher-stat-line">
            {statCards.map((card) => `${card.label}: ${card.value}`).join(' | ')}
          </p>
        </div>
      </div>

      <div className="grid-2 admin-grid" style={{ marginTop: '24px' }}>
        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>My Classes</h2>
              <p className="card-note">Classes where you teach or act as class teacher.</p>
            </div>
          </CardHeader>
          {status === 'error' ? (
            <p className="card-note">Failed to load classes.</p>
          ) : (
            <table className="routine-table admin-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Year</th>
                  <th>Students</th>
                </tr>
              </thead>
              <tbody>
                {myClassrooms.map((classroom) => (
                  <tr key={classroom.id}>
                    <td>{classroom.class_level}</td>
                    <td>{classroom.section}</td>
                    <td>{classroom.academic_year_label || '—'}</td>
                    <td>{classroom.student_count ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Assigned Subjects</h2>
              <p className="card-note">Subject mappings for your classes.</p>
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
                  <tr key={assignment.id}>
                    <td>{assignment.classroom_label}</td>
                    <td>{assignment.subject_name}</td>
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
