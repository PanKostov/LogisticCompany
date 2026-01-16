import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard', accent: 'flare' },
  { path: '/auth', label: 'Access', accent: 'pulse' },
  { path: '/company', label: 'Company', accent: 'flare' },
  { path: '/users', label: 'Users', accent: 'pulse' },
  { path: '/employees', label: 'Employees', accent: 'flare' },
  { path: '/customers', label: 'Customers', accent: 'pulse' },
  { path: '/offices', label: 'Offices', accent: 'flare' },
  { path: '/packets', label: 'Packets', accent: 'pulse' },
  { path: '/reports', label: 'Reports', accent: 'flare' },
]

const routeTitles = navItems.reduce((acc, item) => {
  acc[item.path] = item.label
  return acc
}, {})

export default function AppShell({ session, onRefreshSession, onSignOut, children }) {
  const location = useLocation()
  const pageTitle = routeTitles[location.pathname] || 'Console'
  const user = session?.user

  return (
    <div className="app-shell">
      <aside className="side-panel">
        <div className="brand">
          <div className="brand-mark">LC</div>
          <div>
            <div className="brand-title">Logistiq</div>
            <div className="brand-subtitle">Operations Console</div>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className={`nav-dot ${item.accent}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="session-card">
          <div className="session-label">Session</div>
          <div className="session-status">
            {session?.status === 'loading' ? 'Checking...' : user ? 'Signed in' : 'Signed out'}
          </div>
          <div className="session-meta">
            {user ? (
              <>
                <div>{user.email}</div>
                <div className="session-pill">{user.type || 'regular'}</div>
              </>
            ) : (
              <div>Use Access to sign in.</div>
            )}
          </div>
          <div className="session-actions">
            <button className="ghost" type="button" onClick={onRefreshSession}>
              Refresh
            </button>
            {user ? (
              <button className="primary" type="button" onClick={onSignOut}>
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </aside>
      <main className="main-panel">
        <header className="top-bar">
          <div>
            <div className="eyebrow">Logistics Suite</div>
            <h1>{pageTitle}</h1>
          </div>
          <div className="top-tags">
            <span className="tag">React</span>
            <span className="tag">Nest API</span>
            <span className="tag">Session Ready</span>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}
