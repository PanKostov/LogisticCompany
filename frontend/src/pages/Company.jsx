import { useEffect, useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'

const storageKey = 'logistiq-company-profile'

export default function Company() {
  const [company, setCompany] = useState({
    name: '',
    legalId: '',
    address: '',
    contact: '',
    notes: '',
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCompany(JSON.parse(saved))
    }
  }, [])

  const handleSave = (event) => {
    event.preventDefault()
    localStorage.setItem(storageKey, JSON.stringify(company))
    setStatus('Saved locally. Backend endpoint can replace this later.')
  }

  const handleClear = () => {
    localStorage.removeItem(storageKey)
    setCompany({ name: '', legalId: '', address: '', contact: '', notes: '' })
    setStatus('Cleared local data.')
  }

  return (
    <div className="grid">
      <Panel title="Company profile" subtitle="Stored locally until the backend exposes a company endpoint.">
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
              Clear local
            </button>
          </div>
          {status ? <div className="notice success">{status}</div> : null}
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
