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

export default function Packets() {
  const [packets, setPackets] = useState([])
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')
  const [sendForm, setSendForm] = useState({
    senderId: '',
    receiverId: '',
    fromOfficeId: '',
    toOfficeId: '',
    fromAdress: '',
    toAdress: '',
    weight: '',
    price: '',
    employeeId: '',
  })
  const [receiveForm, setReceiveForm] = useState({ packageId: '', officeId: '' })
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
        fromAdress: sendForm.fromAdress || undefined,
        toAdress: sendForm.toAdress || undefined,
        weight: Number(sendForm.weight),
        price: sendForm.price ? Number(sendForm.price) : undefined,
        employeeId: Number(sendForm.employeeId),
        isRecieved: false,
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

  return (
    <div className="grid">
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
          <Field label="Sender ID" value={sendForm.senderId} onChange={(event) => setSendForm((prev) => ({ ...prev, senderId: event.target.value }))} required />
          <Field label="Receiver ID" value={sendForm.receiverId} onChange={(event) => setSendForm((prev) => ({ ...prev, receiverId: event.target.value }))} required />
          <Field label="From office ID" value={sendForm.fromOfficeId} onChange={(event) => setSendForm((prev) => ({ ...prev, fromOfficeId: event.target.value }))} required />
          <Field label="To office ID" value={sendForm.toOfficeId} onChange={(event) => setSendForm((prev) => ({ ...prev, toOfficeId: event.target.value }))} />
          <Field label="From address" value={sendForm.fromAdress} onChange={(event) => setSendForm((prev) => ({ ...prev, fromAdress: event.target.value }))} />
          <Field label="To address" value={sendForm.toAdress} onChange={(event) => setSendForm((prev) => ({ ...prev, toAdress: event.target.value }))} />
          <Field label="Weight" type="number" step="0.01" value={sendForm.weight} onChange={(event) => setSendForm((prev) => ({ ...prev, weight: event.target.value }))} required />
          <Field label="Price" type="number" step="0.01" value={sendForm.price} onChange={(event) => setSendForm((prev) => ({ ...prev, price: event.target.value }))} />
          <Field label="Employee ID" value={sendForm.employeeId} onChange={(event) => setSendForm((prev) => ({ ...prev, employeeId: event.target.value }))} required />
          <button className="primary" type="submit">
            Register sent packet
          </button>
        </form>
      </Panel>

      <Panel title="Receive packet" subtitle="Mark a packet as delivered to an office.">
        <form className="form" onSubmit={handleReceive}>
          <Field label="Packet ID" value={receiveForm.packageId} onChange={(event) => setReceiveForm((prev) => ({ ...prev, packageId: event.target.value }))} required />
          <Field label="Office ID" value={receiveForm.officeId} onChange={(event) => setReceiveForm((prev) => ({ ...prev, officeId: event.target.value }))} required />
          <button className="primary" type="submit">
            Mark received
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

      <Panel title="Latest packet" subtitle="Selected packet details.">
        <KeyValue data={result} />
        {status ? <div className="notice info">{status}</div> : null}
      </Panel>
    </div>
  )
}
