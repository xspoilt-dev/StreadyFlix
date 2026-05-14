import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !password) {
      setError('Enter email and password')
      return
    }
    try {
      setIsLoading(true)
      setError('')
      const response = await api.login({ email, password })
      if (response.user.role !== 'admin') {
        setError('Admin access only')
        return
      }
      window.localStorage.setItem('sf_admin_authed', '1')
      window.localStorage.setItem('sf_admin_token', response.token)
      navigate('/admin', { replace: true })
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : 'Login failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div>
          <p className="eyebrow">Admin access</p>
          <h1>Sign in to control panel</h1>
          <p className="hero-subtitle">
            Secure access to events, payments, and affiliate settings.
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="admin@streadyflix.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button className="button primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Enter dashboard'}
          </button>
          <button
            className="button outline"
            type="button"
            onClick={() => navigate('/')}
          >
            Back to site
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
