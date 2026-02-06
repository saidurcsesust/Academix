import { useEffect, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

const getRouteInfo = () => {
  const parts = window.location.pathname.split('/').filter(Boolean)
  const typeIndex = parts.indexOf('directory') + 1
  return {
    role: parts[typeIndex],
    id: parts[typeIndex + 1],
  }
}

export default function AdminUserDetails({ apiBase = '/api' }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')
  const { role, id } = getRouteInfo()

  useEffect(() => {
    let ignore = false

    const loadUser = async () => {
      try {
        const endpoint = `${apiBase}/${role}/${id}/`
        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error('Failed')
        }
        const data = await response.json()
        if (!ignore) {
          setUser(data)
          setStatus('ready')
        }
      } catch (error) {
        if (!ignore) setStatus('error')
      }
    }

    loadUser()

    return () => {
      ignore = true
    }
  }, [apiBase, role, id])

  return (
    <section className="page" id="admin-user-details">
      <PageHeader title="User Details" subtitle="Full profile information." />

      <Card className="admin-panel">
        <CardHeader>
          <div>
            <h2>{user?.name || 'Loading...'}</h2>
            <p className="card-note">{role === 'students' ? 'Student' : 'Teacher'} Profile</p>
          </div>
          <a className="text-link" href={`/admin/directory/${role}`}>Back to Directory</a>
        </CardHeader>

        {status === 'error' ? (
          <p className="card-note">Failed to load user details.</p>
        ) : (
          <div className="admin-details">
            {role === 'students' ? (
              <>
                <p><strong>Roll:</strong> {user?.roll}</p>
                <p><strong>Class:</strong> {user?.class_level}</p>
                <p><strong>Section:</strong> {user?.section}</p>
              </>
            ) : (
              <>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone || '—'}</p>
                <p><strong>Department:</strong> {user?.department}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </>
            )}
          </div>
        )}
      </Card>
    </section>
  )
}
