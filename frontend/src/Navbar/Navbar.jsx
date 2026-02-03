export default function Navbar({ onMenuClick, isDrawerOpen, student, showStudent = true }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-button menu-button"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isDrawerOpen}
          onClick={onMenuClick}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6.5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm0 5.5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm0 5.5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" />
          </svg>
        </button>
      </div>
      <div className="topbar-center">
        <p className="school-name">Academix</p>
      </div>
      <div className="topbar-right">
        {showStudent ? (
          <div className="topbar-student">
            <div className="student-info">
              <div>
                <p className="student-name">{student.name}</p>
                <p className="student-meta">Class {student.classLevel} • {student.section}</p>
              </div>
              <span className="pill">Roll {student.roll}</span>
            </div>
          </div>
        ) : null}
        <button className="icon-button" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22a2.4 2.4 0 0 0 2.3-1.7h-4.6A2.4 2.4 0 0 0 12 22Zm7-6.4-1.4-1.5V10a5.6 5.6 0 0 0-4.1-5.4V3a1.5 1.5 0 1 0-3 0v1.6A5.6 5.6 0 0 0 6.4 10v4.1L5 15.6v1.4h14Z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
