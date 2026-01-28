import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'
import SummaryCard from '../Components/SummaryCard'

export default function StudentAttendance({ attendanceStats, calendarDays }) {
  return (
    <section className="page" id="attendance">
      <PageHeader
        title="My Attendance"
        subtitle="Filter by month, year, and subject to view attendance."
        actions={(
          <div className="filter-row">
            <button className="filter-chip" type="button">Jan</button>
            <button className="filter-chip" type="button">2026</button>
            <button className="filter-chip" type="button">All Subjects</button>
          </div>
        )}
      />

      <div className="summary-grid four">
        <SummaryCard title="Present Days" value={attendanceStats.present} />
        <SummaryCard title="Absent Days" value={attendanceStats.absent} />
        <SummaryCard title="Total Days" value={attendanceStats.total} />
        <SummaryCard title="Attendance %" value={`${attendanceStats.percent}%`} />
      </div>

      <Card>
        <CardHeader>
          <h2>Attendance Calendar</h2>
          <p className="card-note">Click a date to see details.</p>
        </CardHeader>
        <div className="calendar-grid">
          {calendarDays.map((day) => (
            <div key={`${day.label}-${day.status}`} className={`calendar-day ${day.status}`}>
              <span className="day-number">{day.label}</span>
              <span className="day-label">{day.day}</span>
            </div>
          ))}
        </div>
      </Card>
      <p className="footer-note">Friday and Saturday are weekends.</p>
    </section>
  )
}
