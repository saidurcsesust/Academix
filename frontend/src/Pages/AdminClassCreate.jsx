import { useEffect, useState } from 'react'
import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function AdminClassCreate({ apiBase = '/api' }) {
  const [teachers, setTeachers] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadOptions = async () => {
      try {
        const [teachersRes, yearsRes] = await Promise.all([
          fetch(`${apiBase}/teachers/`),
          fetch(`${apiBase}/academic-years/`),
        ])

        const [teachersData, yearsData] = await Promise.all([
          teachersRes.ok ? teachersRes.json() : [],
          yearsRes.ok ? yearsRes.json() : [],
        ])

        if (!ignore) {
          setTeachers(Array.isArray(teachersData) ? teachersData : [])
          setAcademicYears(Array.isArray(yearsData) ? yearsData : [])
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

  const handleCreateClass = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      class_level: formData.get('class_level'),
      section: formData.get('section'),
      academic_year: Number(formData.get('academic_year')),
      class_teacher: formData.get('class_teacher') || null,
    }

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      const response = await fetch(`${apiBase}/classrooms/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to create class.')
      }

      setStatusMessage('Class created successfully.')
      form.reset()
    } catch (error) {
      setStatusMessage(error?.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page" id="admin-class-create">
      <PageHeader title="Create Class" subtitle="Create a class and auto-enroll matching students." />

      <div className="admin-form-center">
        <div className="admin-form-toolbar">
          <a className="text-link" href="/admin/classes">Back to Classes</a>
        </div>
        <Card className="admin-panel admin-form-card">
          <div>
            <h5>Students in the same class & section are enrolled automatically.</h5>
          </div>

          <form className="admin-form" onSubmit={handleCreateClass}>
            <div className="admin-form-row">
              <label className="admin-label">
                <span>Class Level</span>
                <input className="admin-input" name="class_level" required />
              </label>
              <label className="admin-label">
                <span>Section</span>
                <input className="admin-input" name="section" required />
              </label>
            </div>

            <label className="admin-label">
              <span>Academic Year</span>
              <select className="filter-select" name="academic_year" required>
                <option value="">Select year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>{year.year}</option>
                ))}
              </select>
            </label>

            <label className="admin-label">
              <span>Class Teacher</span>
              <select className="filter-select" name="class_teacher">
                <option value="">Assign later</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </label>

            <div className="admin-form-actions">
              <button className="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Class'}
              </button>
              {statusMessage && <span className="admin-status">{statusMessage}</span>}
            </div>
          </form>
        </Card>
      </div>
    </section>
  )
}
