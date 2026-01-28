import { useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'
import SummaryCard from '../Components/SummaryCard'

export default function StudentAttendance({ attendanceStats, calendarDays }) {
  const monthOptions = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    [],
  )
  const yearOptions = useMemo(() => ['2025', '2026', '2027'], [])
  const initialDay = useMemo(
    () => calendarDays.find((day) => day.status !== 'weekend') || calendarDays[0],
    [calendarDays],
  )
  const [selectedDay, setSelectedDay] = useState(initialDay)

  const statusLabel = (status) => {
    if (status === 'present') return 'Present'
    if (status === 'absent') return 'Absent'
    return 'Weekend'
  }

  return (
    <section className="page" id="attendance">
      <PageHeader
        title="My Attendance"
        subtitle="Filter by month and year to view attendance."
        actions={(
          <div className="filter-row">
            <select className="filter-select" aria-label="Select month" defaultValue="Jan">
              {monthOptions.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select className="filter-select" aria-label="Select year" defaultValue="2026">
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
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
            <button
              key={`${day.label}-${day.status}`}
              className={`calendar-day ${day.status}${selectedDay?.label === day.label ? ' is-selected' : ''}`}
              type="button"
              onClick={() => setSelectedDay(day)}
            >
              <span className="day-number">{day.label}</span>
              <span className="day-label">{day.day}</span>
            </button>
          ))}
        </div>
        {selectedDay && (
          <div className="attendance-detail">
            <p className="attendance-title">
              {selectedDay.label} {selectedDay.day} — {statusLabel(selectedDay.status)}
            </p>
            <p className="attendance-note">
              {selectedDay.note || 'No remarks for this date.'}
            </p>
          </div>
        )}
      </Card>
      <p className="footer-note">Friday and Saturday are weekends.</p>
    </section>
  )
}
