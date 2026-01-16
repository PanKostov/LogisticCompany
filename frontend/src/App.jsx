import { useCallback, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import AccessGate from './components/AccessGate'
import { apiFetch } from './api/client'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Company from './pages/Company'
import Users from './pages/Users'
import Employees from './pages/Employees'
import Customers from './pages/Customers'
import Offices from './pages/Offices'
import Packets from './pages/Packets'
import Reports from './pages/Reports'

export default function App() {
  const [session, setSession] = useState({ status: 'idle', user: null, raw: null, error: null })
  const isAdmin = session?.user?.type === 'administrator'
  console.log('ADMIN ', session)

  const refreshSession = useCallback(async () => {
    setSession((prev) => ({ ...prev, status: 'loading', error: null }))
    try {
      const data = await apiFetch('/authentication', { method: 'GET' })
      setSession({ status: 'ready', user: data?.user || null, raw: data || null, error: null })
    } catch (error) {
      setSession({ status: 'error', user: null, raw: null, error: error.message })
    }
  }, [])

  const login = async (payload) => {
    await apiFetch('/authentication/login', { method: 'POST', body: payload })
    await refreshSession()
  }

  const signup = async (payload) => {
    await apiFetch('/authentication/signup', { method: 'POST', body: payload })
    await refreshSession()
  }

  const signOut = async () => {
    try {
      await apiFetch('/authentication/sign-out', { method: 'POST' })
    } finally {
      setSession({ status: 'ready', user: null, raw: null, error: null })
    }
  }

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const adminOnly = (element) => (
    <AccessGate allowed={isAdmin} title="Admin access required" message="These tools are restricted to administrator accounts.">
      {element}
    </AccessGate>
  )

  return (
    <AppShell session={session} onRefreshSession={refreshSession} onSignOut={signOut}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<Auth session={session} onLogin={login} onSignup={signup} />} />
        <Route path="/company" element={<Company />} />
        <Route path="/users" element={adminOnly(<Users />)} />
        <Route path="/employees" element={adminOnly(<Employees />)} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/offices" element={adminOnly(<Offices />)} />
        <Route path="/packets" element={<Packets />} />
        <Route path="/reports" element={adminOnly(<Reports />)} />
      </Routes>
    </AppShell>
  )
}
