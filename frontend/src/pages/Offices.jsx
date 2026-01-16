import { useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'
import DataTable from '../components/DataTable'
import KeyValue from '../components/KeyValue'
import { apiFetch } from '../api/client'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'city', label: 'City' },
  { key: 'street', label: 'Street' },
  { key: 'streetNumber', label: 'No.' },
]

export default function Offices() {
  const [offices, setOffices] = useState([])
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')
  const [city, setCity] = useState('')
  const [createForm, setCreateForm] = useState({ city: '', street: '', streetNumber: '' })
  const [updateForm, setUpdateForm] = useState({ id: '', city: '', street: '', streetNumber: '' })
  const [deleteId, setDeleteId] = useState('')
  const [officeId, setOfficeId] = useState('')
  const [employeesId, setEmployeesId] = useState('')
  const [addEmployee, setAddEmployee] = useState({ officeId: '', firstName: '', lastName: '', type: 'courier' })
  const [updateEmployee, setUpdateEmployee] = useState({ officeId: '', employeeId: '', firstName: '', lastName: '', type: '' })

  const loadOfficesByCity = async () => {
    setStatus('')
    try {
      const data = await apiFetch(`/office?city=${encodeURIComponent(city)}`)
      setOffices(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const payload = {
        city: createForm.city,
        street: createForm.street,
        streetNumber: Number(createForm.streetNumber),
      }
      const data = await apiFetch('/admin/office/creation', { method: 'POST', body: payload })
      setResult(data)
      setStatus('Office created.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const payload = {
        city: updateForm.city || undefined,
        street: updateForm.street || undefined,
        streetNumber: updateForm.streetNumber ? Number(updateForm.streetNumber) : undefined,
      }
      const data = await apiFetch(`/admin/office/update/${updateForm.id}`, { method: 'PATCH', body: payload })
      setResult(data)
      setStatus('Office updated.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/office/${deleteId}`, { method: 'DELETE' })
      setResult(data)
      setStatus('Office deleted.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleGetOffice = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/office/${officeId}`)
      setResult(data)
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleGetEmployees = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/office/employees/${employeesId}`)
      setResult({ employees: data })
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleAddEmployee = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/admin/office/employee-for-office/${addEmployee.officeId}`, {
        method: 'POST',
        body: {
          firstName: addEmployee.firstName,
          lastName: addEmployee.lastName,
          type: addEmployee.type,
        },
      })
      setResult(data)
      setStatus('Employee added to office.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleUpdateEmployee = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const payload = {
        officeId: Number(updateEmployee.officeId),
        employeeId: Number(updateEmployee.employeeId),
      }
      if (updateEmployee.firstName) payload.firstName = updateEmployee.firstName
      if (updateEmployee.lastName) payload.lastName = updateEmployee.lastName
      if (updateEmployee.type) payload.type = updateEmployee.type
      const data = await apiFetch(`/admin/office/employee-for-office/${updateEmployee.officeId}`, {
        method: 'PATCH',
        body: payload,
      })
      setResult(data)
      setStatus('Office employee updated.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <div className="grid">
      <Panel title="Offices by city" subtitle="Search offices for a specific city.">
        <form className="form" onSubmit={(event) => {
          event.preventDefault()
          loadOfficesByCity()
        }}>
          <Field label="City" value={city} onChange={(event) => setCity(event.target.value)} />
          <button className="ghost" type="submit">
            Search
          </button>
        </form>
        <DataTable columns={columns} rows={offices} emptyLabel="No offices for this city." />
      </Panel>

      <Panel title="Create office" subtitle="Register a new office location.">
        <form className="form" onSubmit={handleCreate}>
          <Field label="City" value={createForm.city} onChange={(event) => setCreateForm((prev) => ({ ...prev, city: event.target.value }))} required />
          <Field label="Street" value={createForm.street} onChange={(event) => setCreateForm((prev) => ({ ...prev, street: event.target.value }))} required />
          <Field
            label="Street number"
            type="number"
            value={createForm.streetNumber}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, streetNumber: event.target.value }))}
            required
          />
          <button className="primary" type="submit">
            Create office
          </button>
        </form>
      </Panel>

      <Panel title="Update office" subtitle="Edit an office record by ID.">
        <form className="form" onSubmit={handleUpdate}>
          <Field label="Office ID" value={updateForm.id} onChange={(event) => setUpdateForm((prev) => ({ ...prev, id: event.target.value }))} required />
          <Field label="City" value={updateForm.city} onChange={(event) => setUpdateForm((prev) => ({ ...prev, city: event.target.value }))} />
          <Field label="Street" value={updateForm.street} onChange={(event) => setUpdateForm((prev) => ({ ...prev, street: event.target.value }))} />
          <Field label="Street number" type="number" value={updateForm.streetNumber} onChange={(event) => setUpdateForm((prev) => ({ ...prev, streetNumber: event.target.value }))} />
          <button className="primary" type="submit">
            Update office
          </button>
        </form>
      </Panel>

      <Panel title="Delete office" subtitle="Remove an office location.">
        <form className="form" onSubmit={handleDelete}>
          <Field label="Office ID" value={deleteId} onChange={(event) => setDeleteId(event.target.value)} required />
          <button className="danger" type="submit">
            Delete office
          </button>
        </form>
      </Panel>

      <Panel title="Office details" subtitle="Retrieve an office by ID.">
        <form className="form" onSubmit={handleGetOffice}>
          <Field label="Office ID" value={officeId} onChange={(event) => setOfficeId(event.target.value)} required />
          <button className="ghost" type="submit">
            Get office
          </button>
        </form>
      </Panel>

      <Panel title="Office employees" subtitle="List employees assigned to an office.">
        <form className="form" onSubmit={handleGetEmployees}>
          <Field label="Office ID" value={employeesId} onChange={(event) => setEmployeesId(event.target.value)} required />
          <button className="ghost" type="submit">
            Load employees
          </button>
        </form>
      </Panel>

      <Panel title="Add employee to office" subtitle="Assign an employee to a specific office.">
        <form className="form" onSubmit={handleAddEmployee}>
          <Field label="Office ID" value={addEmployee.officeId} onChange={(event) => setAddEmployee((prev) => ({ ...prev, officeId: event.target.value }))} required />
          <Field label="First name" value={addEmployee.firstName} onChange={(event) => setAddEmployee((prev) => ({ ...prev, firstName: event.target.value }))} required />
          <Field label="Last name" value={addEmployee.lastName} onChange={(event) => setAddEmployee((prev) => ({ ...prev, lastName: event.target.value }))} required />
          <label className="field">
            <span>Type</span>
            <select value={addEmployee.type} onChange={(event) => setAddEmployee((prev) => ({ ...prev, type: event.target.value }))}>
              <option value="courier">courier</option>
              <option value="office worker">office worker</option>
            </select>
          </label>
          <button className="primary" type="submit">
            Add employee
          </button>
        </form>
      </Panel>

      <Panel title="Update office employee" subtitle="Edit employee details within an office.">
        <form className="form" onSubmit={handleUpdateEmployee}>
          <Field label="Office ID" value={updateEmployee.officeId} onChange={(event) => setUpdateEmployee((prev) => ({ ...prev, officeId: event.target.value }))} required />
          <Field label="Employee ID" value={updateEmployee.employeeId} onChange={(event) => setUpdateEmployee((prev) => ({ ...prev, employeeId: event.target.value }))} required />
          <Field label="First name" value={updateEmployee.firstName} onChange={(event) => setUpdateEmployee((prev) => ({ ...prev, firstName: event.target.value }))} />
          <Field label="Last name" value={updateEmployee.lastName} onChange={(event) => setUpdateEmployee((prev) => ({ ...prev, lastName: event.target.value }))} />
          <label className="field">
            <span>Type</span>
            <select value={updateEmployee.type} onChange={(event) => setUpdateEmployee((prev) => ({ ...prev, type: event.target.value }))}>
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

      <Panel title="Latest result" subtitle="Office or employee lookup results.">
        <KeyValue data={result} />
        {status ? <div className="notice info">{status}</div> : null}
      </Panel>
    </div>
  )
}
