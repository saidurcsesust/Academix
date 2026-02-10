import { useEffect } from 'react'

export default function Drawer({ open, onClose, navItems, currentRoute, onLogout }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const getBadge = (label) =>
    label
      .split(' ')
      .map((part) => part[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <aside className={`drawer${open ? ' open' : ''}`} aria-label="Quick navigation rail">
      <div className="drawer-panel">
        <div className="drawer-header">
          <p className="drawer-title">Menu</p>
        </div>
        <nav className="rail-nav" aria-label="Sections">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`rail-item${currentRoute === item.path ? ' active' : ''}`}
              onClick={onClose}
            >
              <span className="rail-badge">{getBadge(item.label)}</span>
              <span className="rail-label">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="drawer-footer">
          <button className="drawer-logout" type="button" onClick={onLogout}>
            <span className="rail-badge rail-badge-logout">LO</span>
            <span className="rail-label">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
