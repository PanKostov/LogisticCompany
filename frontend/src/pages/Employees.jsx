import { useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'
import DataTable from '../components/DataTable'
import KeyValue from '../components/KeyValue'
import { apiFetch } from '../api/client'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'type', label: 'Type' },
]

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [status, setStatus] = useState('')
  const [result, setResult] = useState(null)
  const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', type: 'courier' })
  const [updateForm, setUpdateForm] = useState({ id: '', firstName: '', lastName: '', type: '' })
  const [deleteId, setDeleteId] = useState('')
  const [findId, setFindId] = useState('')

  const loadEmployees = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/admin/employee')
      setEmployees(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch('/admin/employee', { method: 'POST', body: createForm })
      setResult(data)
      setStatus('Employee created.')
      await loadEmployees()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleFind = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/employee/${findId}`)
      setResult(data)
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const payload = buildUpdatePayload(updateForm)
      const data = await apiFetch(`/admin/employee/${updateForm.id}`, { method: 'PATCH', body: payload })
      setResult(data)
      setStatus('Employee updated.')
      await loadEmployees()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/employee/${deleteId}`, { method: 'DELETE' })
      setResult(data)
      setStatus('Employee deleted.')
      await loadEmployees()
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <div className="grid">
      <Panel title="Employees" subtitle="List and register team members.">
        <div className="form-actions">
          <button className="ghost" type="button" onClick={loadEmployees}>
            Refresh list
          </button>
        </div>
        <DataTable columns={columns} rows={employees} emptyLabel="No employees yet." />
      </Panel>

      <Panel title="Create employee" subtitle="Assign a courier or office worker.">
        <form className="form" onSubmit={handleCreate}>
          <Field
            label="First name"
            value={createForm.firstName}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, firstName: event.target.value }))}
            required
          />
          <Field
            label="Last name"
            value={createForm.lastName}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, lastName: event.target.value }))}
            required
          />
          <label className="field">
            <span>Type</span>
            <select value={createForm.type} onChange={(event) => setCreateForm((prev) => ({ ...prev, type: event.target.value }))}>
              <option value="courier">courier</option>
              <option value="office worker">office worker</option>
            </select>
          </label>
          <button className="primary" type="submit">
            Create employee
          </button>
        </form>
      </Panel>

      <Panel title="Find employee" subtitle="Lookup an employee by ID.">
        <form className="form" onSubmit={handleFind}>
          <Field label="Employee ID" value={findId} onChange={(event) => setFindId(event.target.value)} required />
          <button className="ghost" type="submit">
            Find employee
          </button>
        </form>
      </Panel>

      <Panel title="Update employee" subtitle="Edit employee details.">
        <form className="form" onSubmit={handleUpdate}>
          <Field label="Employee ID" value={updateForm.id} onChange={(event) => setUpdateForm((prev) => ({ ...prev, id: event.target.value }))} required />
          <Field label="First name" value={updateForm.firstName} onChange={(event) => setUpdateForm((prev) => ({ ...prev, firstName: event.target.value }))} />
          <Field label="Last name" value={updateForm.lastName} onChange={(event) => setUpdateForm((prev) => ({ ...prev, lastName: event.target.value }))} />
          <label className="field">
            <span>Type</span>
            <select value={updateForm.type} onChange={(event) => setUpdateForm((prev) => ({ ...prev, type: event.target.value }))}>
              <option value="">Leave unchanged</option>
              <option value="courier">courier</option>
              <option value="office worker">office worker</option>
            </select>
          </label>
          <button className="primary" type="submit">
            Update employee
          </button>
        </form>
      </Panel>

      <Panel title="Delete employee" subtitle="Remove an employee record.">
        <form className="form" onSubmit={handleDelete}>
          <Field label="Employee ID" value={deleteId} onChange={(event) => setDeleteId(event.target.value)} required />
          <button className="danger" type="submit">
            Delete employee
          </button>
        </form>
      </Panel>

      <Panel title="Selected employee" subtitle="Latest lookup or update result.">
        <KeyValue data={result} />
        {status ? <div className="notice info">{status}</div> : null}
      </Panel>
    </div>
  )
}

function buildUpdatePayload(form) {
  const payload = {}
  if (form.firstName) payload.firstName = form.firstName
  if (form.lastName) payload.lastName = form.lastName
  if (form.type) payload.type = form.type
  return payload
}
