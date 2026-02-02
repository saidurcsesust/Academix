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
}) {
  const latestResult = `${results.exam} • Total ${results.total}`
  const attendanceLabel = attendanceStatus(attendanceStats.percent)
  const dashboardExams = exams.slice(0, 3)

  return (
    <section className="page" id="dashboard">
      <PageHeader
        title="Student Dashboard"
        subtitle={`Today: ${todayLabel}`}
        actions={(
          <div className="chip-row">
            <span className="chip">Class {student.classLevel}</span>
            <span className="chip">Section {student.section}</span>
            <span className="chip">Student ID {student.id}</span>
          </div>
        )}
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

      {/* <div>
        <CardHeader>
          <h2>Upcoming Exams</h2>
          <span className="card-note">Showing {dashboardExams.length} of {exams.length}</span>
        </CardHeader>
        <div className="exam-grid">
          {dashboardExams.map((exam) => (
            <Card className="exam-card" key={`${exam.code}-${exam.date}`}>
              <div className="exam-header">
                <div>
                  <h3 className="exam-title">{exam.subject}</h3>
                  <p className="exam-meta">{exam.code} • {exam.type}</p>
                </div>
                <span className="status-pill upcoming">{exam.status}</span>
              </div>
              <p className="exam-time">{exam.date}</p>
              <p className="exam-detail">Exam Hour: {exam.time}</p>
              <p className="exam-detail">Syllabus: {exam.syllabus}</p>
              <p className="exam-detail">Room: {exam.room}</p>
            </Card>
          ))}
        </div>
      </div> */}

      {/* <div className="quick-links">
        <button type="button" className="primary">Attendance Details</button>
        <button type="button" className="secondary">View Results</button>
        <button type="button" className="secondary">Upcoming Exams</button>
      </div> */}
    </section>
  )
}
