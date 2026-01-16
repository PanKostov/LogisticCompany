import { useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'
import DataTable from '../components/DataTable'
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
  const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', type: 'courier' })

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
      await apiFetch('/admin/employee', { method: 'POST', body: createForm })
      setStatus('Employee created.')
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
        {status ? <div className="notice info">{status}</div> : null}
      </Panel>

      <Panel title="Backend notes" subtitle="Employee update/delete endpoints are not implemented yet.">
        <div className="notice warning">
          You can list and create employees. Update or delete actions will require backend endpoints.
        </div>
      </Panel>
    </div>
  )
}
