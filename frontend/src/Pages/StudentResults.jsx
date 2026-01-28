import { useMemo, useState } from 'react'
import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'
import SummaryCard from '../Components/SummaryCard'

const weights = {
  final: 0.6,
  tests: 0.3,
  attendance: 0.1,
}

const gradeForPercent = (percent) => {
  if (percent >= 90) return 'A+'
  if (percent >= 80) return 'A'
  if (percent >= 70) return 'B'
  if (percent >= 60) return 'C'
  if (percent >= 50) return 'D'
  return 'F'
}

const gpaForGrade = (grade) => {
  const map = { 'A+': 5.0, A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 }
  return map[grade] ?? 0.0
}

const buildAnnualMerged = (semesters) => {
  if (semesters.length === 0) return null
  if (semesters.length === 1) return semesters[0]

  const [first, second] = semesters
  const subjectMap = new Map()

  const addSubject = (subject) => {
    if (!subjectMap.has(subject.subject)) {
      subjectMap.set(subject.subject, { subject: subject.subject })
    }
  }

  first.subjects.forEach(addSubject)
  second.subjects.forEach(addSubject)

  const subjects = Array.from(subjectMap.values()).map((entry) => {
    const firstRow = first.subjects.find((row) => row.subject === entry.subject)
    const secondRow = second.subjects.find((row) => row.subject === entry.subject)

    const firstAvgTests = firstRow
      ? firstRow.classTests.reduce((sum, value) => sum + value, 0) / firstRow.classTests.length
      : 0
    const secondAvgTests = secondRow
      ? secondRow.classTests.reduce((sum, value) => sum + value, 0) / secondRow.classTests.length
      : 0

    const semesterFinal = ((firstRow?.semesterFinal ?? 0) + (secondRow?.semesterFinal ?? 0)) / 2
    const classTests = [
      Number(((firstAvgTests + secondAvgTests) / 2).toFixed(1)),
    ]

    return {
      subject: entry.subject,
      classTests,
      semesterFinal: Number(semesterFinal.toFixed(1)),
      highest: Math.max(firstRow?.highest ?? 0, secondRow?.highest ?? 0),
      pass: Math.max(firstRow?.pass ?? 0, secondRow?.pass ?? 0),
    }
  })

  return {
    id: 'annual',
    label: 'Annual Merged',
    period: 'Semester 1 + Semester 2',
    publishStatus: 'Pending',
    publishDate: 'TBD',
    attendancePercent: Number(((first.attendancePercent + second.attendancePercent) / 2).toFixed(1)),
    subjects,
  }
}

export default function StudentResults({ results }) {
  const annualMerged = useMemo(
    () => buildAnnualMerged(results.semesters),
    [results.semesters],
  )
  const views = useMemo(
    () => [...results.semesters, ...(annualMerged ? [annualMerged] : [])],
    [results.semesters, annualMerged],
  )
  const [activeView, setActiveView] = useState(views[0])

  const totalMarks = activeView.subjects.reduce((sum, row) => {
    const avgTests = row.classTests.reduce((acc, value) => acc + value, 0) / row.classTests.length
    const weighted = (row.semesterFinal * weights.final)
      + (avgTests * weights.tests)
      + (activeView.attendancePercent * weights.attendance)
    return sum + weighted
  }, 0)
  const average = activeView.subjects.length
    ? totalMarks / activeView.subjects.length
    : 0
  const grade = gradeForPercent(average)
  const gpa = gpaForGrade(grade).toFixed(1)

  return (
    <section className="page" id="results">
      <PageHeader
        title="My Results"
        subtitle="Review semester-wise and annual merged performance."
        actions={(
          <div className="filter-row">
            <button className="filter-chip" type="button">Quiz</button>
            <button className="filter-chip" type="button">Class Test</button>
            <button className="filter-chip" type="button">Semester Final</button>
            <select
              className="filter-select"
              aria-label="Select result view"
              value={activeView.id}
              onChange={(event) => {
                const nextView = views.find((view) => view.id === event.target.value)
                if (nextView) setActiveView(nextView)
              }}
            >
              {views.map((view) => (
                <option key={view.id} value={view.id}>{view.label}</option>
              ))}
            </select>
            <select className="filter-select" aria-label="Select session">
              <option value={results.session}>{results.session}</option>
            </select>
          </div>
        )}
      />

      <div className="summary-grid four">
        <SummaryCard title="Total Marks" value={totalMarks.toFixed(1)} />
        <SummaryCard title="GPA / Grade" value={`${gpa} • ${grade}`} />
        <SummaryCard title="Attendance %" value={`${activeView.attendancePercent}%`} />
        <SummaryCard title="Publish Date" value={activeView.publishDate} />
      </div>

      <Card>
        <CardHeader>
          <div>
            <h2>{activeView.label} Results</h2>
            <p className="card-note">{activeView.period}</p>
          </div>
          <span className={`status-pill ${activeView.publishStatus === 'Published' ? 'good' : 'warning'}`}>
            {activeView.publishStatus}
          </span>
        </CardHeader>
        <table className="routine-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Highest</th>
              <th>Pass Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {activeView.subjects.map((row) => {
              const avgTests = row.classTests.reduce((acc, value) => acc + value, 0) / row.classTests.length
              const weighted = (row.semesterFinal * weights.final)
                + (avgTests * weights.tests)
                + (activeView.attendancePercent * weights.attendance)
              const rowGrade = gradeForPercent(weighted)
              return (
                <tr key={row.subject}>
                  <td>{row.subject}</td>
                  <td>
                    {weighted.toFixed(1)}
                    <span className="mark-detail">
                      CT Avg {avgTests.toFixed(1)} • Final {row.semesterFinal}
                    </span>
                  </td>
                  <td>{row.highest}</td>
                  <td>{row.pass}</td>
                  <td>{rowGrade}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{totalMarks.toFixed(1)}</td>
              <td>-</td>
              <td>-</td>
              <td>{grade}</td>
            </tr>
            <tr>
              <td>Average</td>
              <td>{average.toFixed(1)}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tfoot>
        </table>
      </Card>

      <div className="quick-links">
        <button className="primary" type="button">Download PDF</button>
        <button className="secondary" type="button">Print Result</button>
      </div>
    </section>
  )
}
