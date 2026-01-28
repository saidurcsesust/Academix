import Card from '../Components/Card'
import CardHeader from '../Components/CardHeader'
import PageHeader from '../Components/PageHeader'
import SummaryCard from '../Components/SummaryCard'

export default function StudentResults({ results }) {
  return (
    <section className="page" id="results">
      <PageHeader
        title="My Results"
        subtitle="View your published results and performance."
        actions={(
          <div className="filter-row">
            <button className="filter-chip" type="button">Quiz</button>
            <button className="filter-chip" type="button">{results.exam}</button>
            <button className="filter-chip" type="button">2026</button>
          </div>
        )}
      />

      <div className="summary-grid three">
        <SummaryCard title="Total Marks" value={results.total} />
        <SummaryCard title="GPA / Grade" value={`${results.gpa} • ${results.grade}`} />
        <SummaryCard title="Publish Date" value={results.publishDate} />
      </div>

      <Card>
        <CardHeader>
          <h2>Marks Table</h2>
          <span className="pill subtle">Position {results.position}</span>
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
            {results.marks.map((row) => (
              <tr key={row.subject}>
                <td>{row.subject}</td>
                <td>{row.marks}</td>
                <td>{row.highest}</td>
                <td>{row.pass}</td>
                <td>{row.grade}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{results.total}</td>
              <td>-</td>
              <td>-</td>
              <td>{results.grade}</td>
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
