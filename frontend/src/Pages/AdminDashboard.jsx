import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'
import SummaryCard from '../Components/SummaryCard'

export default function AdminDashboard({
  notices = [],
  exams = [],
  faculty = [],
  attendanceStats,
  resultsSummary,
}) {
  const upcomingExams = exams.slice(0, 5)
  const recentNotices = notices.slice(0, 5)
  const totalFaculty = faculty.length
  const totalNotices = notices.length
  const totalExams = exams.length
  const attendancePercent = attendanceStats?.percent ?? 0
  return (
    <section className="page" id="admin-dashboard">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor academics, staff, and notices across the campus."
      />

      <div className="summary-grid four">
        <SummaryCard title="Total Students" value="1280" note="Across all sections" />
        <SummaryCard title="Faculty Members" value={totalFaculty} note="Active teachers" />
        <SummaryCard title="Upcoming Exams" value={totalExams} note="Next 30 days" />
        <SummaryCard title="Attendance Today" value={`${attendancePercent}%`} note="Overall presence" />
      </div>

      <div className="grid-2 admin-grid">
        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Upcoming Exams</h2>
              <p className="card-note">Latest schedule updates</p>
            </div>
            <span className="status-pill upcoming">Live</span>
          </CardHeader>
          <table className="routine-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Date</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {upcomingExams.map((exam) => (
                <tr key={`${exam.code}-${exam.date}`}>
                  <td>{exam.name}</td>
                  <td>{exam.date}</td>
                  <td>{exam.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Results Overview</h2>
              <p className="card-note">Most recent publishing cycle</p>
            </div>
            <span className="status-pill good">Published</span>
          </CardHeader>
          <div className="admin-chart">
            <div>
              <p className="card-title">Latest Result</p>
              <h3>{resultsSummary?.exam ?? 'Quiz-2'}</h3>
              <p className="card-note">Average Score: {resultsSummary?.total ?? 87}</p>
            </div>
            <div className="admin-chart-bars">
              {[72, 84, 92, 76, 88].map((value, index) => (
                <span key={`bar-${index}`} style={{ height: `${value}%` }} />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid-2 admin-grid">
        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Recent Notices</h2>
              <p className="card-note">Broadcasted this week</p>
            </div>
            <span className="status-pill warning">3 Drafts</span>
          </CardHeader>
          <div className="notice-list">
            {recentNotices.map((notice) => (
              <div className="notice-row" key={`admin-${notice.title}`}>
                <div>
                  <p className="notice-title">{notice.title}</p>
                  <p className="notice-date">{notice.date}</p>
                </div>
                <span className="status-pill upcoming">Public</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="admin-panel">
          <CardHeader>
            <div>
              <h2>Faculty Directory</h2>
              <p className="card-note">Recently active staff</p>
            </div>
            <span className="status-pill good">On Duty</span>
          </CardHeader>
          <div className="admin-staff">
            {faculty.slice(0, 4).map((member) => (
              <div className="admin-staff-row" key={member.email}>
                <div>
                  <p className="notice-title">{member.name}</p>
                  <p className="notice-date">{member.department}</p>
                </div>
                <span className="status-pill">{member.role}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
