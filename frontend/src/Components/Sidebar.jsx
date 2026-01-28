export default function Sidebar({ navItems, currentRoute, student }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-student">
        <div className="student-info">
          <div>
            <p className="student-name">{student.name}</p>
            <p className="student-meta">Class {student.classLevel} • {student.section}</p>
          </div>
          <span className="pill">Roll {student.roll}</span>
        </div>
      </div>
      <nav className="nav">
        {navItems.map((item) => (
          <a
            key={item.path}
            className={`nav-item${currentRoute === item.path ? ' active' : ''}`}
            href={item.path}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-card">
        <p className="small-title">Global Rules</p>
        <p className="small-text">View only. Updates are managed by the school admin.</p>
      </div>
    </aside>
  )
}
