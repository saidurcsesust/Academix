import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import NoticeList from '../Components/NoticeList'
import PageHeader from '../Components/PageHeader'
import RoutineTable from '../Components/RoutineTable'
import SummaryCard from '../Components/SummaryCard'

export default function StudentDashboard({
  todayLabel,
  student,
  attendanceStats,
  attendanceStatus,
  weekend,
  todayRoutine,
  notices,
  nextExam,
  exams,
  results,
  enrolledSubjects = [],
}) {
  const latestResult = `${results.exam} • Total ${results.total}`
  const attendanceLabel = attendanceStatus(attendanceStats.percent)
  const dashboardExams = exams.slice(0, 3)
  const latestNotice = notices && notices.length ? notices[0] : null

  return (
    <section className="page" id="dashboard">
      <PageHeader
        title="Student Dashboard"
        subtitle={`Today: ${todayLabel}`}
        actions={latestNotice ? (
          <div className="notice-marquee-wrap">
            <div className="notice-marquee" aria-label="Latest notice">
              <span className="notice-marquee-track" aria-live="polite">
                <span className="notice-marquee-text">
                  {latestNotice.title} — {latestNotice.preview}
                </span>
              </span>
            </div>
          </div>
        ) : null}
      />

      <div className="summary-grid">
        <SummaryCard
          title="Attendance"
          value={(
            <>
              <span className="summary-line">
                Attendance: {attendanceStats.percent}%
              </span>
            </>
          )}
          status={{
            className: `status-pill ${attendanceLabel.toLowerCase()}`,
            label: attendanceLabel,
          }}
        />
        <SummaryCard
          title="Upcoming Exam"
          value={nextExam.date}
          note={`${nextExam.type} • ${nextExam.subject}`}
        />
        <SummaryCard
          title="Latest Result"
          value={results.grade}
          note={latestResult}
        />
      </div>

      <div className="grid-2">
        <Card>
          <CardHeader>
            <h2>Today&apos;s Class Routine</h2>
            <a className="text-link" href="/student/routine">View Full Routine</a>
          </CardHeader>
          {todayRoutine.length === 0 ? (
            <p className="empty-state">Weekend — No Classes</p>
          ) : <RoutineTable rows={todayRoutine} />}
        </Card>
        <Card>
          <CardHeader>
            <h2>Notices</h2>
            <a className="text-link" href="/student/notices">See All Notices</a>
          </CardHeader>
          <NoticeList notices={notices} />
        </Card>
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <Card>
          <CardHeader>
            <h2>Enrolled Subjects</h2>
            <a className="text-link" href="/student/exams">View Exams</a>
          </CardHeader>
          {enrolledSubjects.length === 0 ? (
            <p className="empty-state">No subjects assigned yet.</p>
          ) : (
            <table className="routine-table admin-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {enrolledSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.subject_name}</td>
                    <td>{subject.subject_code || '—'}</td>
                    <td>{subject.teacher_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    
    </section>
  )
}
