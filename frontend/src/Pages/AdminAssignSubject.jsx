import { useEffect, useState } from 'react'
import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function AdminAssignSubject({ apiBase = '/api' }) {
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadOptions = async () => {
      try {
        const [teachersRes, subjectsRes, classroomsRes] = await Promise.all([
          fetch(`${apiBase}/teachers/`),
          fetch(`${apiBase}/subjects/`),
          fetch(`${apiBase}/classrooms/`),
        ])

        const [teachersData, subjectsData, classroomsData] = await Promise.all([
          teachersRes.ok ? teachersRes.json() : [],
          subjectsRes.ok ? subjectsRes.json() : [],
          classroomsRes.ok ? classroomsRes.json() : [],
        ])

        if (!ignore) {
          setTeachers(Array.isArray(teachersData) ? teachersData : [])
          setSubjects(Array.isArray(subjectsData) ? subjectsData : [])
          setClassrooms(Array.isArray(classroomsData) ? classroomsData : [])
        }
      } catch (error) {
        if (!ignore) setStatusMessage('Failed to load options.')
      }
    }

    loadOptions()

    return () => {
      ignore = true
    }
  }, [apiBase])

  const handleAssignSubject = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      classroom: Number(formData.get('classroom')),
      subject: Number(formData.get('subject')),
      teacher: Number(formData.get('teacher')),
    }

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      const response = await fetch(`${apiBase}/classroom-subjects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to assign subject.')
      }

      setStatusMessage('Subject assigned successfully.')
      form.reset()
    } catch (error) {
      setStatusMessage(error?.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page" id="admin-assign-subject">
      <PageHeader title="Assign Subject Teacher" subtitle="Map subjects to teachers for a class." />

      <div className="admin-form-center">
        <div className="admin-form-toolbar">
          <a className="text-link" href="/admin/classes">Back to Classes</a>
        </div>
        <Card className="admin-panel admin-form-card">
          <div>
            <h4>Each subject has one teacher per class.</h4>
          </div>
          <form className="admin-form" onSubmit={handleAssignSubject}>
            <label className="admin-label">
              <span>Class</span>
              <select className="filter-select" name="classroom" required>
                <option value="">Select class</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.class_level}-{classroom.section} ({classroom.academic_year_label || 'Year'})
                  </option>
                ))}
              </select>
            </label>

          <label className="admin-label">
            <span>Subject</span>
            <select className="filter-select" name="subject" required>
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </label>

          <label className="admin-label">
            <span>Subject Teacher</span>
            <select className="filter-select" name="teacher" required>
              <option value="">Select teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </label>

            <div className="admin-form-actions">
              <button className="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Assign Subject'}
              </button>
              {statusMessage && <span className="admin-status">{statusMessage}</span>}
            </div>
          </form>
        </Card>
      </div>
    </section>
  )
}
