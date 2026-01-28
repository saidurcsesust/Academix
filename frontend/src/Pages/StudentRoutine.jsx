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
        <p className="card-note">Selected date: {dailyLabel}</p>
      </Card>

      <Card>
        <CardHeader>
          <h2>Weekly View</h2>
          <label className="input-chip" htmlFor="routine-week">
            <span>Week</span>
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
            <span>Period</span>
            <span>Sunday</span>
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span className="weekend">Friday</span>
            <span className="weekend">Saturday</span>
          </div>
          {weeklyRoutine.map((row) => (
            <div className="weekly-row" key={row.period}>
              <span className="period">{row.period}</span>
              <span>{row.Sun}</span>
              <span>{row.Mon}</span>
              <span>{row.Tue}</span>
              <span>{row.Wed}</span>
              <span>{row.Thu}</span>
              <span className="weekend">Weekend</span>
              <span className="weekend">Weekend</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}
