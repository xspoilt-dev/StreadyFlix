import { useState } from 'react'
import { api } from '../lib/api'

type AuthMode = 'signup' | 'login'

type AuthModalProps = {
  isOpen: boolean
  defaultMode?: AuthMode
  onClose: () => void
  onSuccess: () => void
}

function AuthModal({
  isOpen,
  defaultMode = 'signup',
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        const response = await api.register({ name, email, password })
        window.localStorage.setItem('sf_user_token', response.token)
        window.localStorage.setItem('sf_user_id', response.user.id)
      } else {
        const response = await api.login({ email, password })
        window.localStorage.setItem('sf_user_token', response.token)
        window.localStorage.setItem('sf_user_id', response.user.id)
      }
      onSuccess()
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : 'Unable to sign in'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="meta-label">Quick access</p>
            <h3 id="auth-title">
              {mode === 'signup' ? 'Create your pass' : 'Welcome back'}
            </h3>
          </div>
          <button className="button ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              type="button"
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              type="button"
              onClick={() => setMode('login')}
            >
              Sign in
            </button>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' ? (
              <label className="auth-field">
                <span>Full name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
            ) : null}
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                placeholder="you@example.com"
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
              {isLoading
                ? 'Working...'
                : mode === 'signup'
                  ? 'Create account'
                  : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
