import { useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'

export default function Auth({ session, onLogin, onSignup }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ email: '', password: '', userName: '', egn: '' })
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const handleLogin = async (event) => {
    event.preventDefault()
    setStatus({ type: 'loading', message: '' })
    try {
      await onLogin(loginForm)
      setStatus({ type: 'success', message: 'Signed in successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setStatus({ type: 'loading', message: '' })
    try {
      await onSignup(signupForm)
      setStatus({ type: 'success', message: 'Account created.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const noticeTone = status.type === 'error' ? 'warning' : status.type === 'loading' ? 'info' : status.type

  return (
    <div className="grid">
      <Panel title="Sign in" subtitle="Use your email and password to access the console.">
        <form className="form" onSubmit={handleLogin}>
          <Field
            label="Email"
            type="email"
            placeholder="name@company.com"
            value={loginForm.email}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            value={loginForm.password}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <button className="primary" type="submit">
            Sign in
          </button>
        </form>
      </Panel>

      <Panel title="Create account" subtitle="Register a new user and assign a role later.">
        <form className="form" onSubmit={handleSignup}>
          <Field
            label="Email"
            type="email"
            placeholder="name@company.com"
            value={signupForm.email}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <Field
            label="Password"
            type="password"
            placeholder="Use a strong password"
            value={signupForm.password}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <Field
            label="User name"
            type="text"
            placeholder="Optional display name"
            value={signupForm.userName}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, userName: event.target.value }))}
          />
          <Field
            label="EGN"
            type="text"
            placeholder="Unique identifier"
            value={signupForm.egn}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, egn: event.target.value }))}
            required
          />
          <button className="primary" type="submit">
            Create account
          </button>
        </form>
      </Panel>

      <Panel title="Session" subtitle="The API uses sessions. Refresh to see your current user context.">
        <div className="session-panel">
          <div className="session-row">
            <span>Status</span>
            <strong>{session?.status}</strong>
          </div>
          <div className="session-row">
            <span>User</span>
            <strong>{session?.user ? session.user.email : 'None'}</strong>
          </div>
          {status.message ? <div className={`notice ${noticeTone}`}>{status.message}</div> : null}
        </div>
      </Panel>
    </div>
  )
}
