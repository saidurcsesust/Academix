import { useEffect, useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'
import SummaryCard from '../Components/SummaryCard'
import { buildAttendanceDays } from '../utils/date'

export default function StudentAttendance({ attendanceStats }) {
  const monthOptions = useMemo(
    () => [
      { label: 'Jan', value: 0 },
      { label: 'Feb', value: 1 },
      { label: 'Mar', value: 2 },
      { label: 'Apr', value: 3 },
      { label: 'May', value: 4 },
      { label: 'Jun', value: 5 },
      { label: 'Jul', value: 6 },
      { label: 'Aug', value: 7 },
      { label: 'Sep', value: 8 },
      { label: 'Oct', value: 9 },
      { label: 'Nov', value: 10 },
      { label: 'Dec', value: 11 },
    ],
    [],
  )
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const selectedYear = today.getFullYear()
  const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const calendarDays = useMemo(() => {
    const days = buildAttendanceDays(new Date(selectedYear, selectedMonth, 1))
    return days.map((day) => {
      const dateValue = new Date(selectedYear, selectedMonth, day.label)
      const isFuture = dateValue.getTime() > todayKey
      return {
        ...day,
        status: isFuture ? 'pending' : day.status,
      }
    })
  }, [selectedMonth, selectedYear, todayKey])
  const initialDay = useMemo(
    () => calendarDays.find((day) => day.status !== 'weekend') || calendarDays[0],
    [calendarDays],
  )
  const [selectedDay, setSelectedDay] = useState(initialDay)

  useEffect(() => {
    setSelectedDay(initialDay)
  }, [initialDay])

  const statusLabel = (status) => {
    if (status === 'present') return 'Present'
    if (status === 'absent') return 'Absent'
    if (status === 'pending') return 'Pending'
    return 'Weekend'
  }

  return (
    <section className="page" id="attendance">
      <PageHeader
        title="My Attendance"
        subtitle="Filter by month and year to view attendance."
      />

      <Card className="attendance-summary">
        <CardHeader>
          <h2>Attendance Summary</h2>
          <span className="card-note">This month</span>
        </CardHeader>
        <div className="attendance-summary-grid">
          <div className="attendance-summary-item">
            <p className="card-title">Present Days</p>
            <p className="summary-value">{attendanceStats.present}</p>
          </div>
          <div className="attendance-summary-item">
            <p className="card-title">Absent Days</p>
            <p className="summary-value">{attendanceStats.absent}</p>
          </div>
          <div className="attendance-summary-item">
            <p className="card-title">Total Days</p>
            <p className="summary-value">{attendanceStats.total}</p>
          </div>
          <div className="attendance-summary-item">
            <p className="card-title">Attendance %</p>
            <p className="summary-value">{attendanceStats.percent}%</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <h2>Attendance Calendar</h2>
          <div className="filter-row">
            <p className="card-note">Click a date to see details.</p>
            <select
              className="filter-select"
              aria-label="Select month"
              value={selectedMonth}
              onChange={(event) => {
                setSelectedMonth(Number(event.target.value))
              }}
            >
              {monthOptions.map((month) => (
                <option key={month.label} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <div className="calendar-grid">
          {calendarDays.map((day) => (
            <button
              key={`${day.label}-${day.status}`}
              className={`calendar-day ${day.status}${
                new Date(selectedYear, selectedMonth, day.label).getTime() > todayKey ? ' future' : ''
              }${selectedDay?.label === day.label ? ' is-selected' : ''}`}
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
