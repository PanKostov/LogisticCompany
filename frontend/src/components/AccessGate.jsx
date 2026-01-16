import Panel from './Panel'

export default function AccessGate({ allowed, title, message, children }) {
  if (allowed) {
    return children
  }

  return (
    <div className="grid">
      <Panel
        title={title || 'Admin access required'}
        subtitle={message || 'These tools are reserved for administrator accounts.'}
      >
        <div className="notice warning">Sign in with an administrator account to continue.</div>
      </Panel>
    </div>
  )
}
