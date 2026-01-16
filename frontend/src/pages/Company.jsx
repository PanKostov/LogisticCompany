import { useEffect, useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'
import { apiFetch } from '../api/client'

const emptyCompany = {
  id: null,
  name: '',
  legalId: '',
  address: '',
  contact: '',
  notes: '',
}

export default function Company() {
  const [company, setCompany] = useState(emptyCompany)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const loadCompany = async () => {
    setStatus({ type: 'loading', message: '' })
    try {
      const data = await apiFetch('/company')
      if (data) {
        setCompany({ ...emptyCompany, ...data })
      }
      setStatus({ type: 'idle', message: '' })
    } catch (error) {
      setStatus({ type: 'warning', message: error.message })
    }
  }

  useEffect(() => {
    loadCompany()
  }, [])

  const handleSave = async (event) => {
    event.preventDefault()
    setStatus({ type: 'loading', message: '' })
    try {
      const payload = buildPayload(company)
      const data = company.id
        ? await apiFetch(`/company/${company.id}`, { method: 'PATCH', body: payload })
        : await apiFetch('/company', { method: 'POST', body: payload })
      setCompany({ ...emptyCompany, ...data })
      setStatus({ type: 'success', message: 'Company profile saved.' })
    } catch (error) {
      setStatus({ type: 'warning', message: error.message })
    }
  }

  const handleClear = async () => {
    setStatus({ type: 'loading', message: '' })
    try {
      if (company.id) {
        await apiFetch(`/company/${company.id}`, { method: 'DELETE' })
      }
      setCompany(emptyCompany)
      setStatus({ type: 'success', message: 'Company profile cleared.' })
    } catch (error) {
      setStatus({ type: 'warning', message: error.message })
    }
  }

  const noticeTone = status.type === 'success' ? 'success' : status.type === 'warning' ? 'warning' : 'info'

  return (
    <div className="grid">
      <Panel title="Company profile" subtitle="Manage the primary logistics company record.">
        <form className="form" onSubmit={handleSave}>
          <Field
            label="Company name"
            value={company.name}
            onChange={(event) => setCompany((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Logistic Company Ltd"
            required
          />
          <Field
            label="Legal ID"
            value={company.legalId}
            onChange={(event) => setCompany((prev) => ({ ...prev, legalId: event.target.value }))}
            placeholder="UIC / VAT"
          />
          <Field
            label="Main address"
            value={company.address}
            onChange={(event) => setCompany((prev) => ({ ...prev, address: event.target.value }))}
            placeholder="Street, city"
          />
          <Field
            label="Primary contact"
            value={company.contact}
            onChange={(event) => setCompany((prev) => ({ ...prev, contact: event.target.value }))}
            placeholder="phone or email"
          />
          <label className="field">
            <span>Notes</span>
            <textarea
              rows="4"
              value={company.notes}
              onChange={(event) => setCompany((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Operating hours, service areas, or internal notes."
            />
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">
              Save profile
            </button>
            <button className="ghost" type="button" onClick={handleClear}>
              Clear record
            </button>
          </div>
          {status.message ? <div className={`notice ${noticeTone}`}>{status.message}</div> : null}
        </form>
      </Panel>

      <Panel title="Company snapshot" subtitle="Quick overview for dashboards or future reports.">
        <div className="summary">
          <div>
            <div className="summary-label">Name</div>
            <div className="summary-value">{company.name || 'Not set'}</div>
          </div>
          <div>
            <div className="summary-label">Legal ID</div>
            <div className="summary-value">{company.legalId || 'Not set'}</div>
          </div>
          <div>
            <div className="summary-label">Address</div>
            <div className="summary-value">{company.address || 'Not set'}</div>
          </div>
          <div>
            <div className="summary-label">Contact</div>
            <div className="summary-value">{company.contact || 'Not set'}</div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function buildPayload(company) {
  return {
    name: company.name,
    legalId: company.legalId || undefined,
    address: company.address || undefined,
    contact: company.contact || undefined,
    notes: company.notes || undefined,
  }
}
