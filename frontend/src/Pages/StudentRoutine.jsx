import { useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'
import RoutineTable from '../Components/RoutineTable'
import { formatDate, isWeekend, toDateInputValue, toWeekInputValue } from '../utils/date'

export default function StudentRoutine({ routineItems, weeklyRoutine }) {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(today))
  const [selectedWeek, setSelectedWeek] = useState(() => toWeekInputValue(today))

  const dailyDate = new Date(selectedDate)
  const dailyLabel = formatDate(dailyDate)
  const dailyWeekend = isWeekend(dailyDate)
  const dailyRoutine = dailyWeekend ? [] : routineItems
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
    <section className="page" id="routine">
      <PageHeader
        title="Class Routine"
        subtitle="Daily and weekly views based on your class."
        actions={(
          <div className="toggle-row">
            <button className="toggle active" type="button">Daily View</button>
            <button className="toggle" type="button">Weekly View</button>
          </div>
        )}
      />

      <Card>
        <CardHeader>
          <h2>Daily View</h2>
          <div className="filter-row">
            <label className="input-chip" htmlFor="routine-date">
              <span>Date</span>
              <input
                id="routine-date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>
          </div>
        </CardHeader>
        {dailyRoutine.length === 0 ? (
          <p className="empty-state">Weekend — No Classes</p>
        ) : <RoutineTable rows={dailyRoutine} />}
        {/* <p className="card-note">Selected date: {dailyLabel}</p> */}
      </Card>

      <Card>
        <CardHeader>
          <h2>Weekly View</h2>
          <label className="input-chip" htmlFor="routine-week">
            <input
              id="routine-week"
              type="week"
              value={selectedWeek}
              onChange={(event) => setSelectedWeek(event.target.value)}
            />
          </label>
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
    </section>
  )
}
