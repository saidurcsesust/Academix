import { useState } from 'react'

const ROLE_OPTIONS = [
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'admin', label: 'Admin' },
]

export default function Login({ onLogin, apiBase = '/api' }) {
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!onLogin) return

    const formData = new FormData(event.currentTarget)
    const roll = String(formData.get('roll') || '').trim()
    const password = String(formData.get('password') || '').trim()
    setIsSubmitting(true)
    setError('')

    try {
      const endpoint = `${apiBase}/login/`
      const identifier = role === 'student' ? roll : String(formData.get('email') || '').trim()
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, identifier, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Invalid credentials')
      }

      const data = await response.json()
      onLogin('session', data.role)
    } catch (err) {
      setError(err?.message || 'Login failed. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-shell">
      <section className="login-hero">
        <div className="login-brand">
          <span className="login-mark">AX</span>
          <div>
            <p className="login-title">Academix</p>
            <p className="login-subtitle">Student portal & results hub</p>
          </div>
        </div>

        <h1 className="login-headline">Stay on top of classes, results, and every notice.</h1>
       
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div>
            <p className="login-card-title">Welcome back</p>
            <p className="login-card-subtitle">Use your credentials to continue.</p>
          </div>

          <div className="login-role-toggle" role="tablist" aria-label="Select role">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`login-role-button ${role === option.id ? 'active' : ''}`}
                onClick={() => setRole(option.id)}
                aria-pressed={role === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="login-field">
            <span>{role === 'student' ? 'Roll number' : 'Email'}</span>
            {role === 'student' ? (
              <input type="text" name="roll" placeholder="e.g. 12" autoComplete="username" required />
            ) : (
              <input type="email" name="email" placeholder="admin@academix.com" autoComplete="username" required />
            )}
          </label>

          <label className="login-field">
            <span>Password</span>
            <input type="password" name="password" placeholder="••••••••" autoComplete="current-password" required />
          </label>

          <div className="login-row">
            <label className="login-check">
              <input type="checkbox" name="remember" />
              Remember me
            </label>
            <button className="login-link" type="button">
              Forgot password?
            </button>
          </div>

          <button className="login-submit" type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          {error && <p className="login-error">{error}</p>}


        </form>
      </section>
    </div>
  )
}
