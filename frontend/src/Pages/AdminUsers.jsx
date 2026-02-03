import { useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function AdminUsers({ apiBase = '/api' }) {
  const [userType, setUserType] = useState('student')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateUser = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload =
      userType === 'student'
        ? {
            name: formData.get('name'),
            roll: Number(formData.get('roll')),
            password_hash: formData.get('password'),
            class_level: formData.get('class_level'),
            section: formData.get('section'),
          }
        : {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            department: formData.get('department'),
            role: formData.get('role'),
            password_hash: formData.get('password'),
          }

    const endpoint = `${apiBase}/${userType === 'student' ? 'create-student' : 'create-teacher'}/`

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to create user.')
      }

      setStatusMessage(`Created ${userType} successfully.`)
      event.currentTarget.reset()
    } catch (error) {
      setStatusMessage(error?.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page" id="admin-users">
      <PageHeader title="User Management" subtitle="Create and manage student/teacher accounts." />

      <div className="grid-2 admin-grid">
        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Create User</h2>
              <p className="card-note">Add students and teachers to the system</p>
            </div>
            <span className="status-pill today">New</span>
          </CardHeader>
          <form className="admin-form" onSubmit={handleCreateUser}>
            <div className="admin-form-row">
              <label className="admin-label">
                <span>User Type</span>
                <select
                  value={userType}
                  onChange={(event) => setUserType(event.target.value)}
                  className="filter-select"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </label>
              <label className="admin-label">
                <span>Name</span>
                <input className="admin-input" name="name" required placeholder="Full name" />
              </label>
            </div>

            {userType === 'student' ? (
              <div className="admin-form-row">
                <label className="admin-label">
                  <span>Roll</span>
                  <input className="admin-input" name="roll" type="number" required />
                </label>
                <label className="admin-label">
                  <span>Class Level</span>
                  <input className="admin-input" name="class_level" required />
                </label>
                <label className="admin-label">
                  <span>Section</span>
                  <input className="admin-input" name="section" required />
                </label>
              </div>
            ) : (
              <div className="admin-form-row">
                <label className="admin-label">
                  <span>Email</span>
                  <input className="admin-input" name="email" type="email" required />
                </label>
                <label className="admin-label">
                  <span>Phone</span>
                  <input className="admin-input" name="phone" />
                </label>
                <label className="admin-label">
                  <span>Department</span>
                  <input className="admin-input" name="department" required />
                </label>
                <label className="admin-label">
                  <span>Role</span>
                  <input className="admin-input" name="role" required />
                </label>
              </div>
            )}

            <label className="admin-label">
              <span>Password</span>
              <input className="admin-input" name="password" type="password" required />
            </label>

            <div className="admin-form-actions">
              <button className="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
              {statusMessage && <span className="admin-status">{statusMessage}</span>}
            </div>
          </form>
        </Card>

        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Quick Tips</h2>
              <p className="card-note">Follow these when onboarding</p>
            </div>
          </CardHeader>
          <ul className="admin-list">
            <li>Use a unique roll/email.</li>
            <li>Set a temporary password and reset later.</li>
            <li>Verify class/department for reporting accuracy.</li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
