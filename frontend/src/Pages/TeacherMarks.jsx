import { useEffect, useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function TeacherMarks({ apiBase = '/api', userProfile }) {
  const [teacher, setTeacher] = useState(userProfile || null)
  const [exams, setExams] = useState([])
  const [selectedExam, setSelectedExam] = useState('')
  const [rows, setRows] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('none')
  const [approvalId, setApprovalId] = useState(null)

  useEffect(() => {
    let ignore = false

    const loadTeacherExams = async () => {
      try {
        const [teachersRes] = await Promise.all([
          fetch(`${apiBase}/teachers/`),
        ])

        const teachersData = teachersRes.ok ? await teachersRes.json() : []
        const teacherList = Array.isArray(teachersData) ? teachersData : []
        const fallbackTeacher = teacher || teacherList[0] || null
        if (!ignore) setTeacher(fallbackTeacher)

        if (fallbackTeacher) {
          const examRes = await fetch(`${apiBase}/exams/?teacher=${fallbackTeacher.id}`)
          const examData = examRes.ok ? await examRes.json() : []
          if (!ignore) {
            const list = Array.isArray(examData) ? examData : []
            setExams(list)
            if (!selectedExam && list.length) {
              setSelectedExam(String(list[0].id))
            }
          }
        }
      } catch (error) {
        if (!ignore) setStatusMessage('Failed to load exams.')
      }
    }

    loadTeacherExams()

    return () => {
      ignore = true
    }
  }, [apiBase, teacher, selectedExam])

  useEffect(() => {
    let ignore = false

    const loadApproval = async () => {
      if (!selectedExam || !teacher) return
      try {
        const response = await fetch(
          `${apiBase}/result-approvals/?exam=${selectedExam}&teacher=${teacher.id}`,
        )
        const data = response.ok ? await response.json() : []
        if (!ignore) {
          const approval = Array.isArray(data) && data.length ? data[0] : null
          setApprovalStatus(approval?.status || 'none')
          setApprovalId(approval?.id || null)
        }
      } catch (error) {
        if (!ignore) {
          setApprovalStatus('none')
          setApprovalId(null)
        }
      }
    }

    loadApproval()

    return () => {
      ignore = true
    }
  }, [apiBase, selectedExam, teacher])

  const loadRoster = async () => {
    if (!selectedExam) return
    try {
      const response = await fetch(`${apiBase}/results/roster/?exam=${selectedExam}`)
      const data = response.ok ? await response.json() : []
      const list = Array.isArray(data) ? data : []
      setRows(list.map((row) => ({
        ...row,
        marksInput: row.marks ?? '',
      })))
      setStatusMessage('')
    } catch (error) {
      setStatusMessage('Failed to load students.')
    }
  }

  useEffect(() => {
    let ignore = false

    const load = async () => {
      if (ignore) return
      await loadRoster()
    }

    load()

    return () => {
      ignore = true
    }
  }, [apiBase, selectedExam])

  const examOptions = useMemo(() => exams, [exams])

  const updateRow = (studentId, value) => {
    setRows((prev) => prev.map((row) => (
      row.student_id === studentId ? { ...row, marksInput: value } : row
    )))
  }

  const handleSave = async () => {
    if (!selectedExam || !teacher) return
    if (approvalStatus === 'approved') {
      setStatusMessage('Results are approved and locked.')
      return
    }
    const entries = rows
      .filter((row) => row.marksInput !== '' && row.marksInput !== null)
      .map((row) => ({
        student: row.student_id,
        marks: Number(row.marksInput),
      }))

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      const response = await fetch(`${apiBase}/results/bulk/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam: Number(selectedExam), teacher: teacher.id, entries }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to save marks.')
      }

      setStatusMessage('Marks saved successfully.')
      await loadRoster()
    } catch (error) {
      setStatusMessage(error?.message || 'Failed to save marks.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const requestApproval = async () => {
    if (!selectedExam || !teacher) return
    try {
      setApprovalStatus('pending')
      const response = await fetch(`${apiBase}/result-approvals/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam: Number(selectedExam), teacher: teacher.id }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to request approval.')
      }
      const data = await response.json()
      setApprovalStatus(data.status)
      setApprovalId(data.id)
      setStatusMessage('Approval requested.')
    } catch (error) {
      setApprovalStatus('none')
      setStatusMessage(error?.message || 'Failed to request approval.')
    }
  }

  return (
    <section className="page" id="teacher-marks">
      <PageHeader title="Enter Marks" subtitle="Only assigned subject teachers can submit marks." />

      <Card className="admin-panel attendance-card marks-card">
        <CardHeader>
          <div>
            <h2>Marks Entry</h2>
            <p className="card-note">Select an exam and enter marks for the class.</p>
          </div>
        </CardHeader>

        <div className="admin-form-row">
          <label className="admin-label">
            <span>Exam</span>
            <select
              className="filter-select"
              value={selectedExam}
              onChange={(event) => setSelectedExam(event.target.value)}
            >
              {examOptions.length === 0 ? (
                <option value="">No exams found</option>
              ) : (
                examOptions.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.class_label} • {exam.subject_name} • {exam.exam_type} {exam.exam_no || ''}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        <div className="marks-table-wrap">
          <table className="routine-table admin-table attendance-table marks-table">
            <thead>
              <tr>
                <th>Roll</th>
                <th>Student</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Point</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.student_id}>
                  <td>{row.student_roll}</td>
                  <td>{row.student_name}</td>
                  <td>
                    <input
                      className="admin-input"
                      type="number"
                      min="0"
                      max="100"
                      value={row.marksInput}
                      onChange={(event) => updateRow(row.student_id, event.target.value)}
                      style={{ width: '90px' }}
                      disabled={approvalStatus === 'approved'}
                    />
                  </td>
                  <td>{row.grade || '—'}</td>
                  <td>{row.point ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-form-actions" style={{ marginTop: '16px' }}>
          <button className="primary" type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Marks'}
          </button>
          <button
            className={`secondary${approvalStatus === 'approved' ? ' approval-approved' : approvalStatus === 'pending' ? ' approval-pending' : ''}`}
            type="button"
            onClick={requestApproval}
            disabled={approvalStatus === 'pending' || approvalStatus === 'approved'}
          >
            {approvalStatus === 'approved'
              ? 'Approved'
              : approvalStatus === 'pending'
                ? 'Pending'
                : 'Request Approval'}
          </button>
        </div>
      </Card>
    </section>
  )
}
