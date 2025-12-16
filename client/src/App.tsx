import React from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Stocks from './pages/Stocks'
import Stats from './pages/Stats'
import Login from './pages/Login'
import { clearAuth, getUser, isAuthed } from './lib/auth'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <>{children}</>
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
      end
    >
      <span className="nav-dot" />
      {label}
    </NavLink>
  )
}

function Shell() {
  const navigate = useNavigate()
  const user = getUser()

  function logout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <img src="/logo.png" alt="Green Market" className="brand-icon-img" />
          <div>
            <div className="brand-title">GreenMarket</div>
            <div className="brand-subtitle">Orders v2</div>
          </div>
        </div>
        <div className="topbar-right">
          <span className="user-role">{user ? user.email : 'Utilisateur'}</span>
          {user?.role && <div className="user-pill">{user.role}</div>}
          <button className="btn-logout" onClick={logout} type="button">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <NavItem to="/" label="Tableau de bord" />
            <NavItem to="/commandes" label="Commandes" />
            <NavItem to="/stocks" label="Stocks" />
            <NavItem to="/stats" label="Statistiques" />
          </nav>
        </aside>

        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/commandes" element={<Orders />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={isAuthed() ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Shell />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
