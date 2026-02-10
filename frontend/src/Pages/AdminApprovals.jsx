import { useEffect, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function AdminApprovals({ apiBase = '/api' }) {
  const [approvals, setApprovals] = useState([])
  const [admins, setAdmins] = useState([])
  const [statusMessage, setStatusMessage] = useState('')

  const loadData = async () => {
    try {
      const [approvalsRes, adminsRes] = await Promise.all([
        fetch(`${apiBase}/result-approvals/?status=pending`),
        fetch(`${apiBase}/admins/`),
      ])
      const [approvalsData, adminsData] = await Promise.all([
        approvalsRes.ok ? approvalsRes.json() : [],
        adminsRes.ok ? adminsRes.json() : [],
      ])
      setApprovals(Array.isArray(approvalsData) ? approvalsData : [])
      setAdmins(Array.isArray(adminsData) ? adminsData : [])
      setStatusMessage('')
    } catch (error) {
      setStatusMessage('Failed to load approval requests.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApprove = async (approvalId) => {
    try {
      const adminId = admins[0]?.id
      const response = await fetch(`${apiBase}/result-approvals/${approvalId}/approve/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin: adminId }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to approve.')
      }
      await loadData()
    } catch (error) {
      setStatusMessage(error?.message || 'Failed to approve request.')
    }
  }

  return (
    <section className="page" id="admin-approvals">
      <PageHeader title="Approval Requests" subtitle="Approve teacher marks submissions." />

      <Card className="admin-panel">
        <CardHeader>
          <div>
            <h2>Pending Requests</h2>
            <p className="card-note">Approving locks further edits.</p>
          </div>
        </CardHeader>

        {statusMessage && <p className="card-note">{statusMessage}</p>}

        <div className="approvals-table-wrap">
          <table className="routine-table admin-table approvals-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {approvals.map((approval) => (
                <tr key={approval.id}>
                  <td>{approval.class_label || '—'}</td>
                  <td>{approval.subject_name || '—'}</td>
                  <td>{approval.teacher_name || '—'}</td>
                  <td>{approval.status}</td>
                  <td>
                    <button className="primary" type="button" onClick={() => handleApprove(approval.id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}
