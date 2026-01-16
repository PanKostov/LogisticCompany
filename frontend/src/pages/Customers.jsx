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
  { key: 'egn', label: 'EGN' },
]

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')
  const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', egn: '' })
  const [updateForm, setUpdateForm] = useState({ id: '', firstName: '', lastName: '', egn: '' })
  const [deleteId, setDeleteId] = useState('')
  const [findId, setFindId] = useState('')
  const [findEgn, setFindEgn] = useState('')

  const loadCustomers = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/customer')
      setCustomers(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch('/customer', { method: 'POST', body: createForm })
      setResult(data)
      setStatus('Customer created.')
      await loadCustomers()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const { id, ...payload } = updateForm
      const data = await apiFetch(`/customer/${id}`, { method: 'PATCH', body: payload })
      setResult(data)
      setStatus('Customer updated.')
      await loadCustomers()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/customer/${deleteId}`, { method: 'DELETE' })
      setResult(data)
      setStatus('Customer deleted.')
      await loadCustomers()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleFindById = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/customer/${findId}`)
      setResult(data)
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleFindByEgn = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch('/customer/egn', { method: 'POST', body: { egn: findEgn } })
      setResult(data)
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <div className="grid">
      <Panel title="Customers" subtitle="Create and manage customer profiles.">
        <div className="form-actions">
          <button className="ghost" type="button" onClick={loadCustomers}>
            Refresh list
          </button>
        </div>
        <DataTable columns={columns} rows={customers} emptyLabel="No customers yet." />
      </Panel>

      <Panel title="Create customer" subtitle="Register a new client in the system.">
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
          <Field
            label="EGN"
            value={createForm.egn}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, egn: event.target.value }))}
            required
          />
          <button className="primary" type="submit">
            Create customer
          </button>
        </form>
      </Panel>

      <Panel title="Update customer" subtitle="Adjust customer details by ID.">
        <form className="form" onSubmit={handleUpdate}>
          <Field label="Customer ID" value={updateForm.id} onChange={(event) => setUpdateForm((prev) => ({ ...prev, id: event.target.value }))} required />
          <Field
            label="First name"
            value={updateForm.firstName}
            onChange={(event) => setUpdateForm((prev) => ({ ...prev, firstName: event.target.value }))}
          />
          <Field
            label="Last name"
            value={updateForm.lastName}
            onChange={(event) => setUpdateForm((prev) => ({ ...prev, lastName: event.target.value }))}
          />
          <Field
            label="EGN"
            value={updateForm.egn}
            onChange={(event) => setUpdateForm((prev) => ({ ...prev, egn: event.target.value }))}
          />
          <button className="primary" type="submit">
            Update customer
          </button>
        </form>
      </Panel>

      <Panel title="Find customer" subtitle="Lookup by ID or EGN.">
        <div className="split">
          <form className="form" onSubmit={handleFindById}>
            <Field label="Customer ID" value={findId} onChange={(event) => setFindId(event.target.value)} required />
            <button className="ghost" type="submit">
              Find by ID
            </button>
          </form>
          <form className="form" onSubmit={handleFindByEgn}>
            <Field label="EGN" value={findEgn} onChange={(event) => setFindEgn(event.target.value)} required />
            <button className="ghost" type="submit">
              Find by EGN
            </button>
          </form>
        </div>
      </Panel>

      <Panel title="Delete customer" subtitle="Remove a customer record.">
        <form className="form" onSubmit={handleDelete}>
          <Field label="Customer ID" value={deleteId} onChange={(event) => setDeleteId(event.target.value)} required />
          <button className="danger" type="submit">
            Delete customer
          </button>
        </form>
      </Panel>

      <Panel title="Selected customer" subtitle="Latest lookup or update result.">
        <KeyValue data={result} />
        {status ? <div className="notice info">{status}</div> : null}
      </Panel>
    </div>
  )
}
