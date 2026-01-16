import { useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'
import KeyValue from '../components/KeyValue'
import { apiFetch } from '../api/client'

export default function Users() {
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')
  const [findId, setFindId] = useState('')
  const [findEgn, setFindEgn] = useState('')
  const [egnId, setEgnId] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [updateForm, setUpdateForm] = useState({ email: '', password: '', userName: '', egn: '', isEmployee: '' })
  const [accessId, setAccessId] = useState('')
  const [accessType, setAccessType] = useState('regular')
  const [deleteId, setDeleteId] = useState('')

  const handleFindById = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/user/${findId}`)
      setResult(data)
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleFindByEgn = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch('/admin/user/egn', { method: 'POST', body: { egn: findEgn } })
      setResult(data)
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleGetEgn = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/user/egn/${egnId}`)
      setResult({ egn: data })
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const payload = buildUpdatePayload(updateForm)
      const data = await apiFetch(`/admin/user/${updateId}`, { method: 'PATCH', body: payload })
      setResult(data)
      setStatus('User updated.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleAccess = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/user/user-access/${accessId}`, {
        method: 'PATCH',
        body: { userAccessType: accessType },
      })
      setResult(data)
      setStatus('Access updated.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/user/${deleteId}`, { method: 'DELETE' })
      setResult(data)
      setStatus('User deleted.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <div className="grid">
      <Panel title="Lookup users" subtitle="Search by ID or EGN.">
        <div className="split">
          <form className="form" onSubmit={handleFindById}>
            <Field label="User ID" value={findId} onChange={(event) => setFindId(event.target.value)} required />
            <button className="primary" type="submit">
              Find by ID
            </button>
          </form>
          <form className="form" onSubmit={handleFindByEgn}>
            <Field label="EGN" value={findEgn} onChange={(event) => setFindEgn(event.target.value)} required />
            <button className="primary" type="submit">
              Find by EGN
            </button>
          </form>
        </div>
      </Panel>

      <Panel title="Get EGN" subtitle="Retrieve a user's EGN by ID.">
        <form className="form" onSubmit={handleGetEgn}>
          <Field label="User ID" value={egnId} onChange={(event) => setEgnId(event.target.value)} required />
          <button className="ghost" type="submit">
            Fetch EGN
          </button>
        </form>
      </Panel>

      <Panel title="Update user" subtitle="Assign employee role or update profile fields.">
        <form className="form" onSubmit={handleUpdate}>
          <Field label="User ID" value={updateId} onChange={(event) => setUpdateId(event.target.value)} required />
          <Field
            label="Email"
            type="email"
            value={updateForm.email}
            onChange={(event) => setUpdateForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <Field
            label="Password"
            type="password"
            value={updateForm.password}
            onChange={(event) => setUpdateForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <Field
            label="User name"
            value={updateForm.userName}
            onChange={(event) => setUpdateForm((prev) => ({ ...prev, userName: event.target.value }))}
          />
          <Field
            label="EGN"
            value={updateForm.egn}
            onChange={(event) => setUpdateForm((prev) => ({ ...prev, egn: event.target.value }))}
          />
          <label className="field">
            <span>Employee role</span>
            <select
              value={updateForm.isEmployee}
              onChange={(event) => setUpdateForm((prev) => ({ ...prev, isEmployee: event.target.value }))}
            >
              <option value="">Leave unchanged</option>
              <option value="true">Employee</option>
              <option value="false">Customer</option>
            </select>
          </label>
          <button className="primary" type="submit">
            Update user
          </button>
        </form>
      </Panel>

      <Panel title="Access control" subtitle="Set user access type (administrator or regular).">
        <form className="form" onSubmit={handleAccess}>
          <Field label="User ID" value={accessId} onChange={(event) => setAccessId(event.target.value)} required />
          <label className="field">
            <span>Access type</span>
            <select value={accessType} onChange={(event) => setAccessType(event.target.value)}>
              <option value="administrator">administrator</option>
              <option value="regular">regular</option>
            </select>
          </label>
          <button className="ghost" type="submit">
            Update access
          </button>
        </form>
      </Panel>

      <Panel title="Remove user" subtitle="This action cannot be undone.">
        <form className="form" onSubmit={handleDelete}>
          <Field label="User ID" value={deleteId} onChange={(event) => setDeleteId(event.target.value)} required />
          <button className="danger" type="submit">
            Delete user
          </button>
        </form>
      </Panel>

      <Panel title="Selected user" subtitle="Latest lookup or update result.">
        <KeyValue data={result} />
        {status ? <div className="notice info">{status}</div> : null}
      </Panel>
    </div>
  )
}

function buildUpdatePayload(form) {
  const payload = {}
  if (form.email) payload.email = form.email
  if (form.password) payload.password = form.password
  if (form.userName) payload.userName = form.userName
  if (form.egn) payload.egn = form.egn
  if (form.isEmployee === 'true') payload.isEmployee = true
  if (form.isEmployee === 'false') payload.isEmployee = false
  return payload
}
