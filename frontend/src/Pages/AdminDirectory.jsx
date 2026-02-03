import { useEffect, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function AdminDirectory({ apiBase = '/api' }) {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [status, setStatus] = useState('loading')
  const [classFilter, setClassFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [studentsCollapsed, setStudentsCollapsed] = useState(false)
  const [teachersCollapsed, setTeachersCollapsed] = useState(false)

  const studentList = Array.isArray(students) ? students : []
  const teacherList = Array.isArray(teachers) ? teachers : []

  const classOptions = Array.from(
    new Set(studentList.map((student) => String(student.class_level))),
  ).sort()
  const sectionOptions = Array.from(
    new Set(studentList.map((student) => String(student.section))),
  ).sort()

  useEffect(() => {
    let ignore = false

    const loadDirectory = async () => {
      try {
        const [studentRes, teacherRes] = await Promise.all([
          fetch(`${apiBase}/students/`),
          fetch(`${apiBase}/teachers/`),
        ])

        const [studentData, teacherData] = await Promise.all([
          studentRes.ok ? studentRes.json() : [],
          teacherRes.ok ? teacherRes.json() : [],
        ])

        if (!ignore) {
          setStudents(Array.isArray(studentData) ? studentData : [])
          setTeachers(Array.isArray(teacherData) ? teacherData : [])
          setStatus('ready')
        }
      } catch (error) {
        if (!ignore) setStatus('error')
      }
    }

    loadDirectory()

    return () => {
      ignore = true
    }
  }, [apiBase])

  return (
    <section className="page" id="admin-directory">
      <PageHeader title="User Directory" subtitle="Browse student and teacher records." />

      <div className="grid-2 admin-grid">
        <Card className="admin-panel">
          <CardHeader>
            <div className="admin-card-title">
              <h2>Students</h2>
              <button
                className="admin-collapse"
                type="button"
                onClick={() => setStudentsCollapsed((prev) => !prev)}
              >
                {studentsCollapsed ? 'Expand' : 'Minimize'}
              </button>
            </div>
            <div className="admin-header-actions">
              <div className="filter-row admin-filter-row">
                <select
                  className="filter-select"
                  value={classFilter}
                  onChange={(event) => setClassFilter(event.target.value)}
                >
                  <option value="all">All Classes</option>
                  {classOptions.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <select
                  className="filter-select"
                  value={sectionFilter}
                  onChange={(event) => setSectionFilter(event.target.value)}
                >
                  <option value="all">All Sections</option>
                  {sectionOptions.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          {!studentsCollapsed && (
            status === 'error' ? (
              <p className="card-note">Failed to load students.</p>
            ) : (
              <table className="routine-table admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Roll</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {studentList
                    .filter((student) => {
                      const classMatch =
                        classFilter === 'all' || String(student.class_level) === classFilter
                      const sectionMatch =
                        sectionFilter === 'all' || String(student.section) === sectionFilter
                      return classMatch && sectionMatch
                    })
                    .map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.roll}</td>
                      <td>{student.class_level}</td>
                      <td>{student.section}</td>
                      <td>
                        <a className="text-link" href={`/admin/directory/students/${student.id}`}>
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </Card>

        <Card className="admin-panel">
          <CardHeader>
            <div className="admin-card-title">
              <h2>Teachers</h2>
              <button
                className="admin-collapse"
                type="button"
                onClick={() => setTeachersCollapsed((prev) => !prev)}
              >
                {teachersCollapsed ? 'Expand' : 'Minimize'}
              </button>
            </div>
            <div className="admin-header-actions" />
          </CardHeader>
          {!teachersCollapsed && (
            status === 'error' ? (
              <p className="card-note">Failed to load teachers.</p>
            ) : (
              <table className="routine-table admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {teacherList.map((teacher, index) => (
                    <tr key={teacher.id}>
                      <td>{index + 1}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.department}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.role}</td>
                      <td>
                        <a className="text-link" href={`/admin/directory/teachers/${teacher.id}`}>
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </Card>
      </div>
    </section>
  )
}
