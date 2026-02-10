import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import NoticeList from '../Components/NoticeList'
import PageHeader from '../Components/PageHeader'
import SummaryCard from '../Components/SummaryCard'

export default function StudentDashboard({
  todayLabel,
  attendanceStats,
  attendanceStatus,
  weeklyRoutine,
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
  const days = [
    { label: 'Sunday', key: 'Sun' },
    { label: 'Monday', key: 'Mon' },
    { label: 'Tuesday', key: 'Tue' },
    { label: 'Wednesday', key: 'Wed' },
    { label: 'Thursday', key: 'Thu' },
    { label: 'Friday', key: 'Fri' },
    { label: 'Saturday', key: 'Sat' },
  ]
  const periods = weeklyRoutine.map((row) => row.period)
  const isWeekendDay = (key) => key === 'Fri' || key === 'Sat'

  return (
    <section className="page" id="dashboard">
      <PageHeader
        title="Student Dashboard"
        subtitle={`${todayLabel}`}
        actions={latestNotice ? (
          <div className="notice-marquee-wrap">
            <div className="notice-marquee" aria-label="Latest notice">
              {/* <span className="notice-marquee-label">Notice</span> */}
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
        {/* <SummaryCard
          title="Latest Result"
          value={results.grade}
          note={latestResult}
        /> */}
      </div>

      <div className="grid-2">
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
            <h2>Weekly Class Routine</h2>
          </CardHeader>
          <div className="weekly-table">
            <div className="weekly-row header">
              <span>Day</span>
              {periods.map((period) => (
                <span key={period}>{period}</span>
              ))}
            </div>
            {days.map((day) => {
              const weekendDay = isWeekendDay(day.key)
              return (
                <div className="weekly-row" key={day.key}>
                  <span className={`period${weekendDay ? ' weekend' : ''}`}>{day.label}</span>
                  {weeklyRoutine.map((row) => (
                    <span className={weekendDay ? 'weekend' : ''} key={`${day.key}-${row.period}`}>
                      {weekendDay ? 'Weekend' : row[day.key]}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
          <div className="weekly-cards">
            {days.map((day) => {
              const weekendDay = isWeekendDay(day.key)
              return (
                <div className="weekly-card" key={`card-${day.key}`}>
                  <div className="weekly-card-header">
                    <p className="weekly-card-title">{day.label}</p>
                    {weekendDay ? <span className="weekly-card-tag">Weekend</span> : null}
                  </div>
                  {!weekendDay ? (
                    <div className="weekly-card-body">
                      {weeklyRoutine.map((row) => (
                        <div className="weekly-card-row" key={`card-${day.key}-${row.period}`}>
                          <span className="weekly-card-period">{row.period}</span>
                          <span className="weekly-card-subject">{row[day.key]}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="weekly-card-empty">No Classes</p>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    
    </section>
  )
}
