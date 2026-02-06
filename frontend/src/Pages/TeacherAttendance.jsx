import { useEffect, useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

const toISODate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function TeacherAttendance({ apiBase = '/api', userProfile }) {
  const [teacher, setTeacher] = useState(userProfile || null)
  const [classrooms, setClassrooms] = useState([])
  const [selectedClassroom, setSelectedClassroom] = useState('')
  const [isEditable, setIsEditable] = useState(true)
  const todayIso = toISODate(new Date())
  const [attendanceDate, setAttendanceDate] = useState(todayIso)
  const [records, setRecords] = useState([])
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    let ignore = false

    const loadData = async () => {
      try {
        const [teachersRes, classroomsRes] = await Promise.all([
          fetch(`${apiBase}/teachers/`),
          fetch(`${apiBase}/classrooms/`),
        ])

        const [teachersData, classroomsData] = await Promise.all([
          teachersRes.ok ? teachersRes.json() : [],
          classroomsRes.ok ? classroomsRes.json() : [],
        ])

        if (ignore) return

        const teacherList = Array.isArray(teachersData) ? teachersData : []
        const fallbackTeacher = teacher || teacherList[0] || null
        setTeacher(fallbackTeacher)

        const allClassrooms = Array.isArray(classroomsData) ? classroomsData : []
        const myClassrooms = fallbackTeacher
          ? allClassrooms.filter((room) => Number(room.class_teacher) === Number(fallbackTeacher.id))
          : []

        setClassrooms(myClassrooms)
        if (!selectedClassroom && myClassrooms.length) {
          setSelectedClassroom(String(myClassrooms[0].id))
        }
      } catch (error) {
        if (!ignore) setStatusMessage('Failed to load classrooms.')
      }
    }

    loadData()

    return () => {
      ignore = true
    }
  }, [apiBase, teacher, selectedClassroom])

  useEffect(() => {
    let ignore = false

    const initializeAttendance = async () => {
      if (!selectedClassroom || !attendanceDate) return

      try {
        const response = await fetch(`${apiBase}/class-attendance/initialize/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classroom: Number(selectedClassroom), date: attendanceDate }),
        })

        const data = response.ok ? await response.json() : []
        if (!ignore) {
          setRecords(Array.isArray(data) ? data : [])
          setStatusMessage('')
        }
      } catch (error) {
        if (!ignore) setStatusMessage('Failed to initialize attendance.')
      }
    }

    initializeAttendance()

    return () => {
      ignore = true
    }
  }, [apiBase, selectedClassroom, attendanceDate])

  useEffect(() => {
    const updateEditable = () => {
      const now = new Date()
      const isAfterCutoff = now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() > 0)
      setIsEditable(attendanceDate === todayIso && !isAfterCutoff)
    }

    updateEditable()
    const interval = setInterval(updateEditable, 60000)
    return () => clearInterval(interval)
  }, [attendanceDate, todayIso])

  const sortedRecords = useMemo(() => (
    [...records].sort((a, b) => Number(a.student_roll ?? 0) - Number(b.student_roll ?? 0))
  ), [records])

  const updateStatus = async (recordId, status) => {
    try {
      const response = await fetch(`${apiBase}/class-attendance/${recordId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update attendance.')
      }

      const data = await response.json()
      setRecords((prev) => prev.map((item) => (item.id === recordId ? data : item)))
    } catch (error) {
      setStatusMessage(error?.message || 'Failed to update attendance.')
    }
  }

  return (
    <section className="page" id="teacher-attendance">
      <PageHeader title="Take Attendance" subtitle="Class teachers can mark daily attendance." />

      <Card className="admin-panel attendance-card">
        <CardHeader>
          <div>
            <h2>Class Attendance</h2>
            <p className="card-note">Default is Present. Click to mark Absent or Late.</p>
          </div>
        </CardHeader>

        <div className="admin-form-row">
          <label className="admin-label">
            <span>Classroom</span>
            <select
              className="filter-select"
              value={selectedClassroom}
              onChange={(event) => setSelectedClassroom(event.target.value)}
            >
              {classrooms.length === 0 ? (
                <option value="">No homeroom assigned</option>
              ) : (
                classrooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.class_level}-{room.section} ({room.academic_year_label || 'Year'})
                  </option>
                ))
              )}
            </select>
          </label>
          <label className="admin-label">
            <span>Date</span>
            <input
              className="admin-input"
              type="date"
              value={attendanceDate}
              onChange={(event) => setAttendanceDate(event.target.value)}
              min={todayIso}
              max={todayIso}
            />
          </label>
        </div>

        {statusMessage && <p className="card-note">{statusMessage}</p>}
        {!isEditable && (
          <p className="card-note">Attendance editing closes after 5:00 PM.</p>
        )}

        <table className="routine-table admin-table attendance-table">
          <thead>
            <tr>
              <th>Roll</th>
              <th>Student</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <tr key={record.id} className={`attendance-row ${record.status}`}>
                <td>{record.student_roll}</td>
                <td>{record.student_name}</td>
                <td>
                  <div className="attendance-actions">
                    {['present', 'absent', 'late'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`attendance-btn ${record.status === status ? 'active' : ''} ${status}`}
                        onClick={() => updateStatus(record.id, status)}
                        disabled={!isEditable}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  )
}
