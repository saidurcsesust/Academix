export const formatDate = (date) =>
  date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

export const toDateInputValue = (date) => date.toISOString().split('T')[0]

export const toWeekInputValue = (date) => {
  const target = new Date(date)
  const dayNumber = (target.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNumber + 3)
  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const firstDayNumber = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - firstDayNumber + 3)
  const weekNumber = 1 + Math.round((target - firstThursday) / (7 * 24 * 3600 * 1000))
  const year = target.getFullYear()
  return `${year}-W${String(weekNumber).padStart(2, '0')}`
}

export const isWeekend = (date) => {
  const day = date.getDay()
  return day === 5 || day === 6
}

export const attendanceStatus = (percent) => {
  if (percent >= 90) return 'Good'
  if (percent >= 75) return 'Warning'
  return 'Low'
}

export const buildAttendanceDays = (date) => {
  const days = []
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const notes = {
    3: 'Submitted late due to clinic visit.',
    8: 'Morning assembly duty.',
    12: 'Absent - family event.',
    18: 'Sports practice overlap.',
    24: 'Attended remedial class.',
  }
  for (let i = 1; i <= daysInMonth; i += 1) {
    const current = new Date(year, month, i)
    const weekend = isWeekend(current)
    const statusCycle = ['present', 'present', 'present', 'absent']
    const status = weekend ? 'weekend' : statusCycle[i % statusCycle.length]
    days.push({
      label: i,
      day: current.toLocaleDateString('en-US', { weekday: 'short' }),
      status,
      note: notes[i] || '',
    })
  }
  return days
}
