export default function Sidebar({ navItems, currentRoute }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo-mark">SA</div>
        <div>
          <p className="brand-title">Springfield Academy</p>
          <p className="brand-subtitle">Student Area</p>
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
