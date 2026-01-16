import { useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'
import DataTable from '../components/DataTable'
import KeyValue from '../components/KeyValue'
import { apiFetch } from '../api/client'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'weight', label: 'Weight' },
  { key: 'price', label: 'Price' },
  { key: 'employeeId', label: 'Employee' },
  { key: 'isReceived', label: 'Received' },
]

export default function Packets({ session }) {
  const [packets, setPackets] = useState([])
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')
  const user = session?.user
  const isStaff = user?.type === 'administrator' || user?.isEmployee
  const [sendForm, setSendForm] = useState({
    senderId: '',
    receiverId: '',
    fromOfficeId: '',
    toOfficeId: '',
    fromAddress: '',
    toAddress: '',
    weight: '',
    employeeId: '',
  })
  const [receiveForm, setReceiveForm] = useState({ packageId: '', officeId: '' })
  const [updateForm, setUpdateForm] = useState({
    id: '',
    senderId: '',
    receiverId: '',
    fromOfficeId: '',
    toOfficeId: '',
    fromAddress: '',
    toAddress: '',
    weight: '',
    employeeId: '',
    isReceived: '',
  })
  const [deleteId, setDeleteId] = useState('')
  const [packetId, setPacketId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [customerId, setCustomerId] = useState('')

  const loadAllPackets = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/packet/all')
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleSend = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const payload = {
        senderId: Number(sendForm.senderId),
        receiverId: Number(sendForm.receiverId),
        fromOfficeId: sendForm.fromOfficeId ? Number(sendForm.fromOfficeId) : undefined,
        toOfficeId: sendForm.toOfficeId ? Number(sendForm.toOfficeId) : undefined,
        fromAddress: sendForm.fromAddress || undefined,
        toAddress: sendForm.toAddress || undefined,
        weight: Number(sendForm.weight),
        employeeId: Number(sendForm.employeeId),
        isReceived: false,
      }
      const data = await apiFetch('/packet/sending', { method: 'POST', body: payload })
      setResult(data)
      setStatus('Packet registered as sent.')
      await loadAllPackets()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleReceive = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const payload = {
        packageId: Number(receiveForm.packageId),
        officeId: Number(receiveForm.officeId),
      }
      const data = await apiFetch('/packet/receiving', { method: 'PATCH', body: payload })
      setResult(data)
      setStatus('Packet marked as received.')
      await loadAllPackets()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleGetPacket = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/packet/${packetId}`)
      setResult(data)
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

  const handleUpdate = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const payload = buildUpdatePayload(updateForm)
      const data = await apiFetch(`/packet/${updateForm.id}`, { method: 'PATCH', body: payload })
      setResult(data)
      setStatus('Packet updated.')
      await loadAllPackets()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      const data = await apiFetch(`/packet/${deleteId}`, { method: 'DELETE' })
      setResult(data)
      setStatus('Packet deleted.')
      await loadAllPackets()
    } catch (error) {
      setStatus(error.message)
    }
  }

  const loadMySent = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/user/sent/packets')
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const loadMyReceived = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/user/received-packets')
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  const loadMyExpected = async () => {
    setStatus('')
    try {
      const data = await apiFetch('/user/expected-packets')
      setPackets(data || [])
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <div className="grid">
      {/* Staff have full operational controls; customers see only their own packets. */}
      {isStaff ? (
        <>
          <Panel title="Packets" subtitle="View all registered packets.">
            <div className="form-actions">
              <button className="ghost" type="button" onClick={loadAllPackets}>
                Refresh all
              </button>
              <button className="ghost" type="button" onClick={handleNotReceived}>
                Show not received
              </button>
            </div>
            <DataTable columns={columns} rows={packets} emptyLabel="No packets yet." />
          </Panel>

          <Panel title="Send packet" subtitle="Register a new outbound shipment.">
            <form className="form" onSubmit={handleSend}>
              <Field
                label="Sender ID"
                value={sendForm.senderId}
                onChange={(event) => setSendForm((prev) => ({ ...prev, senderId: event.target.value }))}
                required
              />
              <Field
                label="Receiver ID"
                value={sendForm.receiverId}
                onChange={(event) => setSendForm((prev) => ({ ...prev, receiverId: event.target.value }))}
                required
              />
              <Field
                label="From office ID"
                value={sendForm.fromOfficeId}
                onChange={(event) => setSendForm((prev) => ({ ...prev, fromOfficeId: event.target.value }))}
                required
              />
              <Field
                label="To office ID"
                value={sendForm.toOfficeId}
                onChange={(event) => setSendForm((prev) => ({ ...prev, toOfficeId: event.target.value }))}
              />
              <Field
                label="From address"
                value={sendForm.fromAddress}
                onChange={(event) => setSendForm((prev) => ({ ...prev, fromAddress: event.target.value }))}
              />
              <Field
                label="To address"
                value={sendForm.toAddress}
                onChange={(event) => setSendForm((prev) => ({ ...prev, toAddress: event.target.value }))}
              />
              <Field
                label="Weight"
                type="number"
                step="0.01"
                value={sendForm.weight}
                onChange={(event) => setSendForm((prev) => ({ ...prev, weight: event.target.value }))}
                required
              />
              <Field
                label="Employee ID"
                value={sendForm.employeeId}
                onChange={(event) => setSendForm((prev) => ({ ...prev, employeeId: event.target.value }))}
                required
              />
              <button className="primary" type="submit">
                Register sent packet
              </button>
            </form>
          </Panel>

          <Panel title="Receive packet" subtitle="Mark a packet as delivered to an office.">
            <form className="form" onSubmit={handleReceive}>
              <Field
                label="Packet ID"
                value={receiveForm.packageId}
                onChange={(event) => setReceiveForm((prev) => ({ ...prev, packageId: event.target.value }))}
                required
              />
              <Field
                label="Office ID"
                value={receiveForm.officeId}
                onChange={(event) => setReceiveForm((prev) => ({ ...prev, officeId: event.target.value }))}
                required
              />
              <button className="primary" type="submit">
                Mark received
              </button>
            </form>
          </Panel>

          <Panel title="Update packet" subtitle="Adjust packet details.">
            <form className="form" onSubmit={handleUpdate}>
              <Field
                label="Packet ID"
                value={updateForm.id}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, id: event.target.value }))}
                required
              />
              <Field
                label="Sender ID"
                value={updateForm.senderId}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, senderId: event.target.value }))}
              />
              <Field
                label="Receiver ID"
                value={updateForm.receiverId}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, receiverId: event.target.value }))}
              />
              <Field
                label="From office ID"
                value={updateForm.fromOfficeId}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, fromOfficeId: event.target.value }))}
              />
              <Field
                label="To office ID"
                value={updateForm.toOfficeId}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, toOfficeId: event.target.value }))}
              />
              <Field
                label="From address"
                value={updateForm.fromAddress}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, fromAddress: event.target.value }))}
              />
              <Field
                label="To address"
                value={updateForm.toAddress}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, toAddress: event.target.value }))}
              />
              <Field
                label="Weight"
                type="number"
                step="0.01"
                value={updateForm.weight}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, weight: event.target.value }))}
              />
              <Field
                label="Employee ID"
                value={updateForm.employeeId}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, employeeId: event.target.value }))}
              />
              <label className="field">
                <span>Received</span>
                <select value={updateForm.isReceived} onChange={(event) => setUpdateForm((prev) => ({ ...prev, isReceived: event.target.value }))}>
                  <option value="">Leave unchanged</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </label>
              <button className="primary" type="submit">
                Update packet
              </button>
            </form>
          </Panel>

          <Panel title="Delete packet" subtitle="Remove a packet record.">
            <form className="form" onSubmit={handleDelete}>
              <Field label="Packet ID" value={deleteId} onChange={(event) => setDeleteId(event.target.value)} required />
              <button className="danger" type="submit">
                Delete packet
              </button>
            </form>
          </Panel>

          <Panel title="Packet lookup" subtitle="Search packets or filter by employee or customer.">
            <div className="split">
              <form className="form" onSubmit={handleGetPacket}>
                <Field label="Packet ID" value={packetId} onChange={(event) => setPacketId(event.target.value)} required />
                <button className="ghost" type="submit">
                  Get packet
                </button>
              </form>
              <form className="form" onSubmit={handlePacketsByEmployee}>
                <Field label="Employee ID" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} required />
                <button className="ghost" type="submit">
                  Packets by employee
                </button>
              </form>
              <form className="form" onSubmit={handleSentByCustomer}>
                <Field label="Customer ID" value={customerId} onChange={(event) => setCustomerId(event.target.value)} required />
                <button className="ghost" type="submit">
                  Sent by customer
                </button>
              </form>
              <form className="form" onSubmit={handleReceivedByCustomer}>
                <Field label="Customer ID" value={customerId} onChange={(event) => setCustomerId(event.target.value)} required />
                <button className="ghost" type="submit">
                  Received by customer
                </button>
              </form>
            </div>
          </Panel>
        </>
      ) : (
        <Panel title="My packets" subtitle="View only the packets you have sent or expect to receive.">
          <div className="form-actions">
            <button className="ghost" type="button" onClick={loadMySent}>
              Sent
            </button>
            <button className="ghost" type="button" onClick={loadMyReceived}>
              Received
            </button>
            <button className="ghost" type="button" onClick={loadMyExpected}>
              Expected
            </button>
          </div>
          <DataTable columns={columns} rows={packets} emptyLabel="No packets yet." />
        </Panel>
      )}

      <Panel title="Latest packet" subtitle="Selected packet details.">
        <KeyValue data={result} />
        {status ? <div className="notice info">{status}</div> : null}
      </Panel>
    </div>
  )
}

function buildUpdatePayload(form) {
  const payload = {}
  if (form.senderId) payload.senderId = Number(form.senderId)
  if (form.receiverId) payload.receiverId = Number(form.receiverId)
  if (form.fromOfficeId) payload.fromOfficeId = Number(form.fromOfficeId)
  if (form.toOfficeId) payload.toOfficeId = Number(form.toOfficeId)
  if (form.fromAddress) payload.fromAddress = form.fromAddress
  if (form.toAddress) payload.toAddress = form.toAddress
  if (form.weight) payload.weight = Number(form.weight)
  if (form.employeeId) payload.employeeId = Number(form.employeeId)
  if (form.isReceived === 'true') payload.isReceived = true
  if (form.isReceived === 'false') payload.isReceived = false
  return payload
}
