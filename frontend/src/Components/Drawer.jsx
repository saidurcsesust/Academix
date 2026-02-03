import Sidebar from './Sidebar'

export default function Drawer({ open, onClose, navItems, currentRoute, student, onLogout }) {
  return (
    <div className={`drawer${open ? ' open' : ''}`} aria-hidden={!open}>
      <button className="drawer-backdrop" type="button" aria-label="Close navigation" onClick={onClose} />
      <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Navigation">
        <div className="drawer-header">
          <p className="drawer-title">Menu</p>
          <button className="icon-button" type="button" aria-label="Close menu" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.2 6.2a1 1 0 0 1 1.4 0L12 10.6l4.4-4.4a1 1 0 1 1 1.4 1.4L13.4 12l4.4 4.4a1 1 0 0 1-1.4 1.4L12 13.4l-4.4 4.4a1 1 0 0 1-1.4-1.4L10.6 12 6.2 7.6a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
        <Sidebar
          navItems={navItems}
          currentRoute={currentRoute}
          student={student}
          className="drawer-sidebar"
          onNavigate={onClose}
          onLogout={onLogout}
        />
      </div>
    </div>
  )
}
