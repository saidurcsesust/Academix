export default function SummaryCard({ title, value, note, status }) {
  return (
    <div className="card summary-card">
      <p className="card-title">{title}</p>
      <p className="summary-value">{value}</p>
      {note ? <p className="card-note">{note}</p> : null}
      {status ? <span className={status.className}>{status.label}</span> : null}
    </div>
  )
}
