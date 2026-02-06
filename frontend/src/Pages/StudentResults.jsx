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

  const getTestScores = (semester, subjectName) => (
    semester.classTests ? semester.classTests.map((test) => test.scores[subjectName] ?? 0) : []
  )

  const testsCount = Math.max(first.classTests?.length || 0, second.classTests?.length || 0)
  const classTests = Array.from({ length: testsCount }, (_, index) => {
    const firstTest = first.classTests?.[index]
    const secondTest = second.classTests?.[index]
    const name = firstTest?.name || secondTest?.name || `Class Test ${index + 1}`

    const scores = {}
    subjectMap.forEach((_, subjectName) => {
      const firstScore = firstTest?.scores?.[subjectName] ?? 0
      const secondScore = secondTest?.scores?.[subjectName] ?? 0
      scores[subjectName] = Number(((firstScore + secondScore) / 2).toFixed(1))
    })

    return { name, scores }
  })

  const subjects = Array.from(subjectMap.values()).map((entry) => {
    const firstRow = first.subjects.find((row) => row.subject === entry.subject)
    const secondRow = second.subjects.find((row) => row.subject === entry.subject)

    const firstScores = getTestScores(first, entry.subject)
    const secondScores = getTestScores(second, entry.subject)
    const firstAvgTests = firstScores.length
      ? firstScores.reduce((sum, value) => sum + value, 0) / firstScores.length
      : 0
    const secondAvgTests = secondScores.length
      ? secondScores.reduce((sum, value) => sum + value, 0) / secondScores.length
      : 0

    const semesterFinal = ((firstRow?.semesterFinal ?? 0) + (secondRow?.semesterFinal ?? 0)) / 2

    return {
      subject: entry.subject,
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
    classTests,
    subjects,
  }
}

export default function StudentResults({ results, apiResults = [] }) {
  if (Array.isArray(apiResults) && apiResults.length) {
    return (
      <section className="page" id="results">
        <PageHeader
          title="My Results"
          subtitle="Results published by your subject teachers."
        />

        <Card>
          <CardHeader>
            <h2>Results</h2>
          </CardHeader>
          <table className="routine-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Exam</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Point</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {apiResults.map((row) => (
                <tr key={row.id}>
                  <td>{row.subject_name || '—'}</td>
                  <td>{row.subject_code || '—'}</td>
                  <td>{row.exam_type === 'class_test' ? `Class Test ${row.exam_no || ''}`.trim() : 'Semester Final'}</td>
                  <td>{row.marks}</td>
                  <td>{row.grade}</td>
                  <td>{row.point}</td>
                  <td>{row.exam_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    )
  }
  const annualMerged = useMemo(
    () => buildAnnualMerged(results.semesters),
    [results.semesters],
  )
  const views = useMemo(
    () => [...results.semesters, ...(annualMerged ? [annualMerged] : [])],
    [results.semesters, annualMerged],
  )
  const [activeView, setActiveView] = useState(views[0])
  const [resultType, setResultType] = useState('overall')

  const getClassTestScores = (view, subject) => (
    view.classTests ? view.classTests.map((test) => test.scores[subject] ?? 0) : []
  )

  const totals = useMemo(() => {
    const subjectCount = activeView.subjects.length || 1
    const total = activeView.subjects.reduce((sum, row) => {
      const testScores = getClassTestScores(activeView, row.subject)
      const avgTests = testScores.length
        ? testScores.reduce((acc, value) => acc + value, 0) / testScores.length
        : 0
      let value = 0
      if (resultType === 'classTest') {
        value = avgTests
      } else if (resultType === 'semesterFinal') {
        value = row.semesterFinal
      } else {
        value = (row.semesterFinal * weights.final)
          + (avgTests * weights.tests)
          + (activeView.attendancePercent * weights.attendance)
      }
      return sum + value
    }, 0)

    const average = total / subjectCount
    const grade = gradeForPercent(average)
    const gpa = gpaForGrade(grade).toFixed(1)

    return { total, average, grade, gpa }
  }, [activeView, resultType])

  return (
    <section className="page" id="results">
      <PageHeader
        title="My Results"
        subtitle="Review semester-wise and annual merged performance."
        actions={(
          <div className="filter-row results-filter-row">
            <button
              className={`filter-chip result-toggle${resultType === 'classTest' ? ' active' : ''}`}
              type="button"
              onClick={() => setResultType(resultType === 'classTest' ? 'overall' : 'classTest')}
            >
              Class Test
            </button>
            <button
              className={`filter-chip result-toggle${resultType === 'semesterFinal' ? ' active' : ''}`}
              type="button"
              onClick={() => setResultType(resultType === 'semesterFinal' ? 'overall' : 'semesterFinal')}
            >
              Semester Final
            </button>
            <select
              className="filter-select results-select"
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
          </div>
        )}
      />

      <div className="summary-grid four">
        <SummaryCard title="Total Marks" value={totals.total.toFixed(1)} />
        <SummaryCard title="GPA / Grade" value={`${totals.gpa} • ${totals.grade}`} />
        <SummaryCard title="Attendance %" value={`${activeView.attendancePercent}%`} />
        <SummaryCard title="Publish Date" value={activeView.publishDate} />
      </div>

      {resultType === 'classTest' ? (
        <div className="result-tests">
          {activeView.classTests.map((test) => (
            <Card key={`${activeView.id}-${test.name}`}>
              <CardHeader>
                <div>
                  <h2>{test.name}</h2>
                  <p className="card-note">{activeView.label} • {activeView.period}</p>
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
                    const mark = test.scores[row.subject] ?? 0
                    return (
                      <tr key={`${test.name}-${row.subject}`}>
                        <td>{row.subject}</td>
                        <td>{mark}</td>
                        <td>{row.highest}</td>
                        <td>{row.pass}</td>
                        <td>{gradeForPercent(mark)}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td>
                      {activeView.subjects
                        .reduce((sum, row) => sum + (test.scores[row.subject] ?? 0), 0)}
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Average</td>
                    <td>
                      {(
                        activeView.subjects
                          .reduce((sum, row) => sum + (test.scores[row.subject] ?? 0), 0)
                        / (activeView.subjects.length || 1)
                      ).toFixed(1)}
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                </tfoot>
              </table>
            </Card>
          ))}
        </div>
      ) : (
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
                const testScores = getClassTestScores(activeView, row.subject)
                const avgTests = testScores.length
                  ? testScores.reduce((acc, value) => acc + value, 0) / testScores.length
                  : 0
                const weighted = (resultType === 'semesterFinal')
                  ? row.semesterFinal
                  : (row.semesterFinal * weights.final)
                    + (avgTests * weights.tests)
                    + (activeView.attendancePercent * weights.attendance)
                const rowGrade = gradeForPercent(weighted)
                return (
                  <tr key={row.subject}>
                    <td>{row.subject}</td>
                    <td>
                      {weighted.toFixed(1)}
                      {resultType === 'overall' && (
                        <span className="mark-detail">
                          CT Avg {avgTests.toFixed(1)} • Final {row.semesterFinal}
                        </span>
                      )}
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
                <td>{totals.total.toFixed(1)}</td>
                <td>-</td>
                <td>-</td>
                <td>{totals.grade}</td>
              </tr>
              <tr>
                <td>Average</td>
                <td>{totals.average.toFixed(1)}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tfoot>
          </table>
        </Card>
      )}

      <div className="quick-links">
        <button className="primary" type="button">Download PDF</button>
        <button className="secondary" type="button">Print Result</button>
      </div>
    </section>
  )
}
