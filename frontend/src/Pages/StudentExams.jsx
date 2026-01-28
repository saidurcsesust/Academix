import Card from '../Components/Card'
import PageHeader from '../Components/PageHeader'

export default function StudentExams({ exams }) {
  return (
    <section className="page" id="exams">
      <PageHeader
        title="Upcoming Exams"
        subtitle="Stay on top of the exam calendar and required coverage."
        actions={(
          <div className="filter-row">
            <button className="filter-chip" type="button">All Exams</button>
            <button className="filter-chip" type="button">This Week</button>
            <button className="filter-chip" type="button">February</button>
          </div>
        )}
      />

      <div className="exam-grid">
        {exams.map((exam) => (
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
    </section>
  )
}
