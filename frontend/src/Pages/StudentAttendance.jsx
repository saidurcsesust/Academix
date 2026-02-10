import { useEffect, useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'

export default function StudentAttendance({ attendanceStats, attendanceRecords = [] }) {
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
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const currentDate = today.getDate()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const selectedYear = currentYear
  const todayKey = new Date(currentYear, currentMonth, currentDate).getTime()
  const recordsByDate = useMemo(() => {
    const map = new Map()
    attendanceRecords.forEach((record) => {
      if (record?.date) {
        map.set(record.date, record.status || 'pending')
      }
    })
    return map
  }, [attendanceRecords])

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const days = []
    for (let i = 1; i <= daysInMonth; i += 1) {
      const dateValue = new Date(selectedYear, selectedMonth, i)
      const isFuture = dateValue.getTime() > todayKey
      const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const isWeekend = dateValue.getDay() === 5 || dateValue.getDay() === 6
      const recordStatus = recordsByDate.get(dateKey)
      const status = isFuture
        ? 'pending'
        : isWeekend
          ? 'weekend'
          : (recordStatus || 'pending')

      days.push({
        label: i,
        day: dateValue.toLocaleDateString('en-US', { weekday: 'short' }),
        status,
        note:
          status === 'present'
            ? 'Marked present by class teacher.'
            : status === 'absent'
              ? 'Marked absent by class teacher.'
              : status === 'late'
                ? 'Marked late by class teacher.'
                : '',
      })
    }

    return days
  }, [selectedMonth, selectedYear, todayKey, recordsByDate])
  const initialDay = useMemo(
    () => {
      const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear
      if (isCurrentMonth) {
        const todayDay = calendarDays.find((day) => day.label === currentDate)
        if (todayDay) return todayDay
      }
      return calendarDays.find((day) => day.status !== 'weekend') || calendarDays[0]
    },
    [calendarDays, selectedMonth, selectedYear, currentMonth, currentYear, currentDate],
  )
  const [selectedDay, setSelectedDay] = useState(initialDay)

  useEffect(() => {
    setSelectedDay(initialDay)
  }, [initialDay])

  const statusLabel = (status) => {
    if (status === 'present') return 'Present'
    if (status === 'absent') return 'Absent'
    if (status === 'late') return 'Late'
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
