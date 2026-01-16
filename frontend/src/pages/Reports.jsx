import { useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'
import DataTable from '../components/DataTable'
import { apiFetch } from '../api/client'

const packetColumns = [
  { key: 'id', label: 'ID' },
  { key: 'employeeId', label: 'Employee' },
  { key: 'weight', label: 'Weight' },
  { key: 'isReceived', label: 'Received' },
]

const customerColumns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
]

const employeeColumns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'type', label: 'Type' },
]

export default function Reports() {
  const [packets, setPackets] = useState([])
  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [status, setStatus] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [period, setPeriod] = useState({ from: '', to: '' })

  const handleEmployees = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/admin/employee')
      setEmployees(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleCustomers = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/customer')
      setCustomers(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleAllPackets = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/packet/all')
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handlePacketsByEmployee = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/packet/all-from-employee/${employeeId}`)
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleNotReceived = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/packet/not-received')
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleSentByCustomer = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/packet/sent-by-customer/${customerId}`)
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleReceivedByCustomer = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/packet/received-by-customer/${customerId}`)
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleRevenue = (event) => {
    event.preventDefault()
    setStatus('Revenue calculation requires backend support for packet pricing.')
  }

  return (
    <div className="grid">
      <Panel title="Staff report" subtitle="All employees registered in the company.">
        <div className="form-actions">
          <button className="ghost" type="button" onClick={handleEmployees}>
            Load employees
          </button>
        </div>
        <DataTable columns={employeeColumns} rows={employees} emptyLabel="No employees loaded." />
      </Panel>

      <Panel title="Customer report" subtitle="All customers registered in the company.">
        <div className="form-actions">
          <button className="ghost" type="button" onClick={handleCustomers}>
            Load customers
          </button>
        </div>
        <DataTable columns={customerColumns} rows={customers} emptyLabel="No customers loaded." />
      </Panel>

      <Panel title="Packet report" subtitle="All packets in the system and advanced filters.">
        <div className="report-actions">
          <button className="ghost" type="button" onClick={handleAllPackets}>
            Load all packets
          </button>
          <button className="ghost" type="button" onClick={handleNotReceived}>
            Not received
          </button>
        </div>
        <DataTable columns={packetColumns} rows={packets} emptyLabel="No packets loaded." />
      </Panel>

      <Panel title="Packets by employee" subtitle="All packets registered by a specific employee.">
        <form className="form" onSubmit={handlePacketsByEmployee}>
          <Field label="Employee ID" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} required />
          <button className="ghost" type="submit">
            Load packets
          </button>
        </form>
      </Panel>

      <Panel title="Packets by customer" subtitle="View sent or received packets for a customer.">
        <form className="form" onSubmit={handleSentByCustomer}>
          <Field label="Customer ID" value={customerId} onChange={(event) => setCustomerId(event.target.value)} required />
          <button className="ghost" type="submit">
            Sent packets
          </button>
        </form>
        <form className="form" onSubmit={handleReceivedByCustomer}>
          <Field label="Customer ID" value={customerId} onChange={(event) => setCustomerId(event.target.value)} required />
          <button className="ghost" type="submit">
            Received packets
          </button>
        </form>
      </Panel>

      <Panel title="Revenue" subtitle="Total revenue for a selected period.">
        <form className="form" onSubmit={handleRevenue}>
          <Field
            label="From"
            type="date"
            value={period.from}
            onChange={(event) => setPeriod((prev) => ({ ...prev, from: event.target.value }))}
          />
          <Field
            label="To"
            type="date"
            value={period.to}
            onChange={(event) => setPeriod((prev) => ({ ...prev, to: event.target.value }))}
          />
          <button className="ghost" type="submit">
            Calculate
          </button>
        </form>
        <div className="notice warning">Pricing fields are not present in the backend yet.</div>
      </Panel>

      {status ? <div className="notice info">{status}</div> : null}
    </div>
  )
}
