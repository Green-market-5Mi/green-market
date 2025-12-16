import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { setAuth } from '../lib/auth'

type LocationState = { from?: { pathname?: string } } | null

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState

  const redirectTo = useMemo(() => state?.from?.pathname || '/', [state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.login(email.trim(), password)
      setAuth(res.token, res.user)
      navigate(redirectTo, { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Connexion impossible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Green Market" className="brand-icon-img" />
          <div>
            <div className="brand-title">GreenMarket Orders v2</div>
            <div className="brand-subtitle">Connectez-vous pour gérer les commandes</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="auth-label">
            Mot de passe
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>

        </form>
      </div>
    </div>
  )
}
