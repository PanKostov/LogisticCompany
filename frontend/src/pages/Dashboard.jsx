import { Link } from 'react-router-dom'
import Panel from '../components/Panel'

const quickLinks = [
  { to: '/packets', label: 'Register a packet', detail: 'Send or receive a shipment fast.' },
  { to: '/customers', label: 'Add a customer', detail: 'Create or update customer profiles.' },
  { to: '/employees', label: 'Add an employee', detail: 'Courier or office team onboarding.' },
  { to: '/reports', label: 'Run reports', detail: 'Monitor volume and service levels.' },
]

export default function Dashboard() {
  return (
    <div className="stack">
      <section className="hero">
        <div>
          <p className="eyebrow">Logistics Overview</p>
          <h2>Move smarter with a live operations cockpit.</h2>
          <p className="hero-text">
            Track shipments, organize teams, and keep customers in the loop. This console connects every office and
            delivery milestone in one view.
          </p>
          <div className="hero-actions">
            <Link className="primary" to="/packets">
              Start a shipment
            </Link>
            <Link className="ghost" to="/reports">
              View performance
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-kicker">Today</div>
          <div className="hero-metric">52</div>
          <div className="hero-sub">Packets in motion</div>
          <div className="hero-meta">+8 since yesterday</div>
        </div>
      </section>

      <div className="grid">
        <Panel title="Quick actions" subtitle="Jump straight into the workflows you use most.">
          <div className="cards">
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} className="action-card">
                <div className="action-title">{item.label}</div>
                <div className="action-detail">{item.detail}</div>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Role guidelines" subtitle="Align tasks to employee or customer access rules.">
          <div className="notes">
            <div>
              <strong>Employees</strong>
              <p>Can register sent and received packets and view all shipments in the system.</p>
            </div>
            <div>
              <strong>Customers</strong>
              <p>See only the packets they have sent or received via the customer reports section.</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
