export default function Sidebar({ navItems, currentRoute, student, className = '', onNavigate }) {
  return (
    <aside className={`sidebar ${className}`.trim()}>
      <nav className="nav">
        {navItems.map((item) => (
          <a
            key={item.path}
            className={`nav-item${currentRoute === item.path ? ' active' : ''}`}
            href={item.path}
            onClick={onNavigate}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-logout">
        <a className="drawer-logout" href="/logout">Logout</a>
      </div>
    </aside>
  )
}
