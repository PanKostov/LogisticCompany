export default function KeyValue({ data }) {
  if (!data) {
    return <div className="empty">No record selected.</div>
  }

  const entries = Object.entries(data)

  return (
    <div className="kv-grid">
      {entries.map(([key, value]) => (
        <div key={key} className="kv-item">
          <div className="kv-key">{key}</div>
          <div className="kv-value">{formatValue(value)}</div>
        </div>
      ))}
    </div>
  )
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
