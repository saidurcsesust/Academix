export default function SummaryCard({ title, value, note, status }) {
  return (
    <div className="card summary-card">
      <p className="card-title">{title}</p>
      {status ? (
        <div className="summary-row">
          <p className="summary-value">{value}</p>
          <span className={status.className}>{status.label}</span>
        </div>
      ) : (
        <p className="summary-value">{value}</p>
      )}
      {note ? <p className="card-note">{note}</p> : null}
    </div>
  )
}
