import { useEffect, useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

const getDirectoryRole = () => {
  const parts = window.location.pathname.split('/').filter(Boolean)
  const typeIndex = parts.indexOf('directory') + 1
  return parts[typeIndex]
}

export default function AdminDirectoryList({ apiBase = '/api' }) {
  const role = getDirectoryRole()
  const isStudents = role === 'students'
  const title = isStudents ? 'Student Directory' : 'Teacher Directory'
  const subtitle = isStudents
    ? 'Browse student records by class and section.'
    : 'Browse teacher records by department.'

  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [classFilter, setClassFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')

  useEffect(() => {
    let ignore = false

    const loadDirectory = async () => {
      try {
        const response = await fetch(`${apiBase}/${role}/`)
        const data = response.ok ? await response.json() : []
        if (!ignore) {
          const list = Array.isArray(data) ? data : []
          setItems(list)
          setStatus('ready')
        }
      } catch (error) {
        if (!ignore) setStatus('error')
      }
    }

    if (role === 'students' || role === 'teachers') {
      loadDirectory()
    } else {
      setStatus('error')
    }

    return () => {
      ignore = true
    }
  }, [apiBase, role])

  const classOptions = useMemo(() => (
    Array.from(new Set(items.map((item) => String(item.class_level)))).sort()
  ), [items])

  const sectionOptions = useMemo(() => (
    Array.from(new Set(items.map((item) => String(item.section)))).sort()
  ), [items])

  const deptOptions = useMemo(() => (
    Array.from(new Set(items.map((item) => String(item.department)))).sort()
  ), [items])

  const filteredItems = items.filter((item) => {
    if (isStudents) {
      const classMatch = classFilter === 'all' || String(item.class_level) === classFilter
      const sectionMatch = sectionFilter === 'all' || String(item.section) === sectionFilter
      return classMatch && sectionMatch
    }

    const deptMatch = deptFilter === 'all' || String(item.department) === deptFilter
    return deptMatch
  })
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (isStudents) {
      const aRoll = Number(a?.roll ?? 0)
      const bRoll = Number(b?.roll ?? 0)
      return aRoll - bRoll
    }
    const aId = Number(a?.id ?? 0)
    const bId = Number(b?.id ?? 0)
    return aId - bId
  })

  return (
    <section className="page" id="admin-directory-list">
      <PageHeader title={title} subtitle={subtitle} />
      <a className="text-link" href="/admin/directory">Back to User Directory</a>

      <div className="admin-directory-center">
        <Card className="admin-panel admin-directory-panel admin-directory-panel--list">
          <CardHeader>
            <div className="admin-card-title">
              <h2>{isStudents ? 'Students' : 'Teachers'}</h2>
              <span className="card-note">{filteredItems.length} records</span>
            </div>
            <div className="admin-header-actions">
              {isStudents ? (
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
              ) : (
                <div className="filter-row admin-filter-row">
                  <select
                    className="filter-select"
                    value={deptFilter}
                    onChange={(event) => setDeptFilter(event.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {deptOptions.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardHeader>

          {status === 'error' ? (
            <p className="card-note">Failed to load records.</p>
          ) : (
            <div className="admin-directory-list">
              {sortedItems.map((item) => (
                <a
                  key={item.id}
                  className="admin-directory-item"
                  href={`/admin/directory/${role}/${item.id}`}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {isStudents
                        ? `Roll ${item.roll} · Class ${item.class_level} · ${item.section}`
                        : `${item.department} · ${item.role}`}
                    </small>
                  </div>
                  <span className="text-link">Open</span>
                </a>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
