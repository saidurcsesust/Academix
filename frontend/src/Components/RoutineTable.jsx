export default function RoutineTable({ rows }) {
  return (
    <>
      <table className="routine-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Subject</th>
            <th>Teacher</th>
            <th>Room</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.time}>
              <td>{item.time}</td>
              <td>{item.subject}</td>
              <td>{item.teacher}</td>
              <td>{item.room}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="routine-cards">
        {rows.map((item) => (
          <div className="routine-card" key={`${item.time}-${item.subject}`}>
            <div className="routine-card-header">
              <p className="routine-card-time">{item.time}</p>
              <span className="routine-card-subject">{item.subject}</span>
            </div>
            <p className="routine-card-meta">Teacher: {item.teacher}</p>
            <p className="routine-card-meta">Room: {item.room}</p>
          </div>
        ))}
      </div>
    </>
  )
}
