import { useEffect, useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function TeacherExams({ apiBase = '/api', userProfile }) {
  const [teacher, setTeacher] = useState(userProfile || null)
  const [assignments, setAssignments] = useState([])
  const [semesters, setSemesters] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadOptions = async () => {
      try {
        const [teachersRes, assignmentsRes, semestersRes] = await Promise.all([
          fetch(`${apiBase}/teachers/`),
          fetch(`${apiBase}/classroom-subjects/`),
          fetch(`${apiBase}/semesters/`),
        ])

        const [teachersData, assignmentsData, semestersData] = await Promise.all([
          teachersRes.ok ? teachersRes.json() : [],
          assignmentsRes.ok ? assignmentsRes.json() : [],
          semestersRes.ok ? semestersRes.json() : [],
        ])

        if (ignore) return

        const teacherList = Array.isArray(teachersData) ? teachersData : []
        const fallbackTeacher = teacher || teacherList[0] || null
        setTeacher(fallbackTeacher)

        const allAssignments = Array.isArray(assignmentsData) ? assignmentsData : []
        const filtered = fallbackTeacher
          ? allAssignments.filter((assignment) => Number(assignment.teacher) === Number(fallbackTeacher.id))
          : []
        setAssignments(filtered)
        setSemesters(Array.isArray(semestersData) ? semestersData : [])
      } catch (error) {
        if (!ignore) setStatusMessage('Failed to load options.')
      }
    }

    loadOptions()

    return () => {
      ignore = true
    }
  }, [apiBase, teacher])

  const assignmentOptions = useMemo(() => assignments, [assignments])

  const handleCreateExam = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      classroom_subject: Number(formData.get('classroom_subject')),
      semester: Number(formData.get('semester')),
      exam_type: formData.get('exam_type'),
      exam_no: formData.get('exam_no') ? Number(formData.get('exam_no')) : null,
      date: formData.get('date'),
      start_time: formData.get('start_time'),
      duration_minutes: Number(formData.get('duration_minutes')),
    }

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      const response = await fetch(`${apiBase}/exams/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to create exam.')
      }

      setStatusMessage('Exam created successfully.')
      form.reset()
    } catch (error) {
      setStatusMessage(error?.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page" id="teacher-exams">
      <PageHeader title="Create Exam" subtitle="Create exams for your assigned subjects." />

      <Card className="admin-panel attendance-card exam-form-card">
        <CardHeader>
          <div>
            <h2>New Exam</h2>
            <p className="card-note">Visible to all students enrolled in the class.</p>
          </div>
        </CardHeader>

        <form className="admin-form" onSubmit={handleCreateExam}>
          <label className="admin-label">
            <span>Class & Subject</span>
            <select className="filter-select" name="classroom_subject" required>
              <option value="">Select assignment</option>
              {assignmentOptions.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.classroom_label} • {assignment.subject_name}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-label">
            <span>Semester</span>
            <select className="filter-select" name="semester" required>
              <option value="">Select semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.academic_year_label || semester.academic_year} - Semester {semester.semester_no}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-form-row">
            <label className="admin-label">
              <span>Exam Type</span>
              <select className="filter-select" name="exam_type" required>
                <option value="class_test">Class Test</option>
                <option value="semester_final">Semester Final</option>
              </select>
            </label>
            <label className="admin-label">
              <span>Exam No (optional)</span>
              <input className="admin-input" name="exam_no" type="number" min="1" />
            </label>
          </div>

          <div className="admin-form-row">
            <label className="admin-label">
              <span>Date</span>
              <input className="admin-input" type="date" name="date" required />
            </label>
            <label className="admin-label">
              <span>Start Time</span>
              <input className="admin-input" type="time" name="start_time" required />
            </label>
            <label className="admin-label">
              <span>Duration (minutes)</span>
              <input className="admin-input" type="number" name="duration_minutes" defaultValue="90" min="1" required />
            </label>
          </div>

          <div className="admin-form-actions">
            <button className="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create Exam'}
            </button>
            {statusMessage && <span className="admin-status">{statusMessage}</span>}
          </div>
        </form>
      </Card>
    </section>
  )
}
