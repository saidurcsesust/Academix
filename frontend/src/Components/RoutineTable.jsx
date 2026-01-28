export default function RoutineTable({ rows }) {
  return (
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
  )
}
