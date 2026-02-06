import { useEffect, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function AdminClasses({ apiBase = '/api' }) {
  const [classrooms, setClassrooms] = useState([])
  const [assignments, setAssignments] = useState([])
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    let ignore = false

    const loadData = async () => {
      try {
        const [classroomsRes, assignmentsRes] = await Promise.all([
          fetch(`${apiBase}/classrooms/`),
          fetch(`${apiBase}/classroom-subjects/`),
        ])

        const [classroomsData, assignmentsData] = await Promise.all([
          classroomsRes.ok ? classroomsRes.json() : [],
          assignmentsRes.ok ? assignmentsRes.json() : [],
        ])

        if (!ignore) {
          setClassrooms(Array.isArray(classroomsData) ? classroomsData : [])
          setAssignments(Array.isArray(assignmentsData) ? assignmentsData : [])
          setStatusMessage('')
        }
      } catch (error) {
        if (!ignore) setStatusMessage('Failed to load class data.')
      }
    }

    loadData()

    return () => {
      ignore = true
    }
  }, [apiBase])

  return (
    <section className="page" id="admin-classes">
      <PageHeader title="Class Management" subtitle="Create classes, assign subjects, and set class teachers." />

      <div className="admin-action-row">
        <a className="admin-action-btn" href="/admin/classes/new">Create Class</a>
        <a className="admin-action-btn" href="/admin/classes/assign">Assign Subject Teacher</a>
      </div>

      {statusMessage && <p className="card-note" style={{ marginTop: '16px' }}>{statusMessage}</p>}

      <div className="grid-2 admin-grid" style={{ marginTop: '24px' }}>
        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Classes</h2>
              <p className="card-note">Current class list with student counts.</p>
            </div>
          </CardHeader>
          <table className="routine-table admin-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Class Teacher</th>
                <th>Year</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((classroom) => (
                <tr key={classroom.id}>
                  <td>{classroom.class_level}</td>
                  <td>{classroom.section}</td>
                  <td>{classroom.class_teacher_name || '—'}</td>
                  <td>{classroom.academic_year_label || '—'}</td>
                  <td>{classroom.student_count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Subject Assignments</h2>
              <p className="card-note">Mapped subjects per class.</p>
            </div>
          </CardHeader>
          <table className="routine-table admin-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.classroom_label}</td>
                  <td>{assignment.subject_name}</td>
                  <td>{assignment.teacher_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </section>
  )
}
