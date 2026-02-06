import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function StudentExams({ exams }) {
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const parseExamDate = (exam) => {
    const parsed = new Date(`${exam.date} ${exam.time}`)
    if (!Number.isNaN(parsed.getTime())) return parsed
    return new Date(exam.date)
  }

  const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const getStatus = (examDate) => {
    const examDay = normalizeDate(examDate)
    if (examDay.getTime() === startOfToday.getTime()) return 'Today'
    if (examDay > startOfToday) return 'Upcoming'
    return 'Completed'
  }

  const sortedExams = [...exams].sort((a, b) => parseExamDate(a) - parseExamDate(b))
  const subjects = [...new Set(sortedExams.map((exam) => exam.subject))]
  const nextExam = sortedExams.find((exam) => parseExamDate(exam) >= startOfToday) || sortedExams[0]
  const nextExamDate = nextExam ? normalizeDate(parseExamDate(nextExam)) : null
  const daysUntil = nextExamDate
    ? Math.max(0, Math.round((nextExamDate - startOfToday) / (1000 * 60 * 60 * 24)))
    : null

  const countdownLabel = daysUntil === 0
    ? 'Next Exam is today'
    : `Next Exam in ${daysUntil} days`

  return (
    <section className="page" id="exams">
      <PageHeader
        title="Upcoming Exams"
        subtitle="Track upcoming assessments and plan your preparation."
      />

      <div className="exam-grid">
        {sortedExams.map((exam) => {
          const examDate = parseExamDate(exam)
          const status = getStatus(examDate)
          return (
          <Card className="exam-card" key={`${exam.code}-${exam.date}`}>
            <div className="exam-header">
              <div>
                <h3 className="exam-title">{exam.name}</h3>
                {/* <p className="exam-meta">{exam.type}</p> */}
              </div>
              <span className={`status-pill ${status.toLowerCase()}`}>{status}</span>
            </div>
            <p className="exam-time">{exam.date} • {exam.time}</p>
            <p className="exam-subject">Subject: {exam.subject}</p>
            {exam.syllabus && <p className="exam-detail">Syllabus: {exam.syllabus}</p>}
            {exam.room && <p className="exam-detail">Room: {exam.room}</p>}
          </Card>
        )})}
      </div>
    </section>
  )
}
