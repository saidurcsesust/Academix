export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-center">
        <p className="school-name">Academix</p>
      </div>
      <div className="topbar-right">
        <button className="icon-button" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22a2.4 2.4 0 0 0 2.3-1.7h-4.6A2.4 2.4 0 0 0 12 22Zm7-6.4-1.4-1.5V10a5.6 5.6 0 0 0-4.1-5.4V3a1.5 1.5 0 1 0-3 0v1.6A5.6 5.6 0 0 0 6.4 10v4.1L5 15.6v1.4h14Z" />
          </svg>
        </button>
        <details className="profile-menu">
          <summary>Profile</summary>
          <div className="profile-dropdown">
            <a href="/student/profile">Profile</a>
            <a href="/student/change-password">Change Password</a>
            <a href="/logout">Logout</a>
          </div>
        </details>
      </div>
    </header>
  )
}
