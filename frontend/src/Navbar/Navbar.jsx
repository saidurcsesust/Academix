export default function Navbar({ onMenuClick, isDrawerOpen, navItems = [], currentRoute }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <p className="school-name">Academix</p>
        </div>
        <div className="navbar-links">
          {navItems.map((item) => (
            <a
              key={item.path}
              className={`navbar-link${currentRoute === item.path ? ' active' : ''}`}
              href={item.path}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="topbar-right">
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
      </div>
    </header>
  )
}
