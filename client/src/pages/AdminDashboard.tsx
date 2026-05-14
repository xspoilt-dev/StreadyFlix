import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { AffiliateItem, EventItem } from '../lib/api'

type AdminSection =
  | 'dashboard'
  | 'events'
  | 'purchases'
  | 'affiliates'
  | 'users'
  | 'settings'

function AdminDashboard() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([])
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    window.localStorage.removeItem('sf_admin_authed')
    window.localStorage.removeItem('sf_admin_token')
    window.location.href = '/admin/login'
  }

  useEffect(() => {
    const token = window.localStorage.getItem('sf_admin_token') ?? ''
    const loadData = async () => {
      try {
        const [eventsResponse, affiliatesResponse] = await Promise.all([
          api.listEvents(),
          api.listAffiliates(token),
        ])
        setEvents(eventsResponse)
        setAffiliates(affiliatesResponse)
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load admin data'
        setError(message)
      }
    }

    loadData()
  }, [])

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section)
    setIsSidebarOpen(false)
  }

  return (
    <div className="admin-shell">
      <aside
        className={`admin-sidebar ${isSidebarOpen ? 'is-open' : ''}`}
        aria-hidden={!isSidebarOpen}
      >
        <div className="admin-brand">
          <span className="brand-mark" aria-hidden="true"></span>
          <div>
            <p className="brand-title">StreadyFlix</p>
            <p className="brand-subtitle">Admin Suite</p>
          </div>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${
              activeSection === 'dashboard' ? 'active' : ''
            }`}
            type="button"
            onClick={() => handleSectionChange('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`admin-nav-item ${
              activeSection === 'events' ? 'active' : ''
            }`}
            type="button"
            onClick={() => handleSectionChange('events')}
          >
            Events
          </button>
          <button
            className={`admin-nav-item ${
              activeSection === 'purchases' ? 'active' : ''
            }`}
            type="button"
            onClick={() => handleSectionChange('purchases')}
          >
            Purchases
          </button>
          <button
            className={`admin-nav-item ${
              activeSection === 'affiliates' ? 'active' : ''
            }`}
            type="button"
            onClick={() => handleSectionChange('affiliates')}
          >
            Affiliates
          </button>
          <button
            className={`admin-nav-item ${
              activeSection === 'users' ? 'active' : ''
            }`}
            type="button"
            onClick={() => handleSectionChange('users')}
          >
            Users
          </button>
          <button
            className={`admin-nav-item ${
              activeSection === 'settings' ? 'active' : ''
            }`}
            type="button"
            onClick={() => handleSectionChange('settings')}
          >
            Settings
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="button ghost" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        {isSidebarOpen ? (
          <div
            className="admin-overlay"
            role="presentation"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        ) : null}
        <header className="admin-topbar">
          <button
            className="admin-toggle"
            type="button"
            aria-label="Toggle admin menu"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div>
            <p className="meta-label">Control Panel</p>
            <h1>
              {activeSection === 'dashboard'
                ? 'Event Control Center'
                : activeSection.charAt(0).toUpperCase() +
                  activeSection.slice(1)}
            </h1>
          </div>
          <div className="header-actions">
            <button
              className="button ghost"
              type="button"
              onClick={() => handleSectionChange('events')}
            >
              New Event
            </button>
            <button
              className="button primary"
              type="button"
              onClick={() => {
                window.location.href = '/player'
              }}
            >
              Open Live Room
            </button>
          </div>
        </header>

        <section className="admin-content">
          {activeSection === 'dashboard' ? (
            <div className="admin-grid">
              <div className="admin-card">
                <p className="meta-label">Events</p>
                <h2>
                  {events.filter((event) => event.status === 'Live').length}{' '}
                  Live ·{' '}
                  {events.filter((event) => event.status === 'Draft').length}{' '}
                  Draft
                </h2>
                <p className="event-copy">
                  Manage thumbnails, stream URLs, and schedule in one place.
                </p>
                <button
                  className="button outline"
                  type="button"
                  onClick={() => handleSectionChange('events')}
                >
                  Manage events
                </button>
              </div>
              <div className="admin-card">
                <p className="meta-label">Purchases</p>
                <h2>$42,180</h2>
                <p className="event-copy">
                  Track pass sales, refunds, and live conversions.
                </p>
                <button
                  className="button outline"
                  type="button"
                  onClick={() => handleSectionChange('purchases')}
                >
                  View payments
                </button>
              </div>
              <div className="admin-card">
                <p className="meta-label">Affiliates</p>
                <h2>{affiliates.length} Partners</h2>
                <p className="event-copy">
                  Create codes, set commission, and pay out balances.
                </p>
                <button
                  className="button outline"
                  type="button"
                  onClick={() => handleSectionChange('affiliates')}
                >
                  Manage affiliates
                </button>
              </div>
              {error ? (
                <div className="admin-card wide">
                  <p className="meta-label">Notice</p>
                  <p className="auth-error">{error}</p>
                </div>
              ) : null}
              <div className="admin-card wide">
                <p className="meta-label">Live status</p>
                <div className="admin-status">
                  <div>
                    <h3>Winter Clash Championship</h3>
                    <p className="event-copy">
                      Stream healthy · 18,230 watching
                    </p>
                  </div>
                  <span className="chip live">Live</span>
                </div>
                <div className="admin-status-grid">
                  <div>
                    <p className="meta-label">Primary</p>
                    <p className="meta-value">Streaming</p>
                  </div>
                  <div>
                    <p className="meta-label">Backup</p>
                    <p className="meta-value">Ready</p>
                  </div>
                  <div>
                    <p className="meta-label">Chat</p>
                    <p className="meta-value">Enabled</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'events' ? (
            <div className="admin-list">
              <div className="admin-list-head">
                <div>
                  <p className="meta-label">Events</p>
                  <h2>Manage events</h2>
                </div>
                <button className="button primary" type="button">
                  Create event
                </button>
              </div>
              <div className="admin-table">
                {events.map((eventItem) => (
                  <div className="admin-row" key={eventItem._id}>
                    <div>
                      <p className="admin-row-title">{eventItem.name}</p>
                      <p className="event-copy">{eventItem.description}</p>
                    </div>
                    <div className="admin-row-meta">
                      <span className="chip">{eventItem.status}</span>
                      <span className="meta-label">
                        ${eventItem.pass_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeSection === 'purchases' ? (
            <div className="admin-list">
              <div className="admin-list-head">
                <div>
                  <p className="meta-label">Purchases</p>
                  <h2>Recent checkout activity</h2>
                </div>
                <button className="button outline" type="button">
                  Export CSV
                </button>
              </div>
              <div className="admin-table">
                <div className="admin-row">
                  <div>
                    <p className="admin-row-title">Championship Pass</p>
                    <p className="event-copy">Order #SF-2041 · Stripe</p>
                  </div>
                  <div className="admin-row-meta">
                    <span className="chip">$24.99</span>
                    <span className="meta-label">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'affiliates' ? (
            <div className="admin-list">
              <div className="admin-list-head">
                <div>
                  <p className="meta-label">Affiliates</p>
                  <h2>Affiliate partners</h2>
                </div>
                <button className="button primary" type="button">
                  New affiliate
                </button>
              </div>
              <div className="admin-table">
                {affiliates.map((affiliate) => (
                  <div className="admin-row" key={affiliate._id}>
                    <div>
                      <p className="admin-row-title">{affiliate.name}</p>
                      <p className="event-copy">Code: {affiliate.code}</p>
                    </div>
                    <div className="admin-row-meta">
                      <span className="chip">{affiliate.balance.toFixed(2)}</span>
                      <span className="meta-label">
                        {affiliate.commission_percent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeSection === 'users' ? (
            <div className="admin-list">
              <div className="admin-list-head">
                <div>
                  <p className="meta-label">Users</p>
                  <h2>Customer access list</h2>
                </div>
                <button className="button outline" type="button">
                  Invite user
                </button>
              </div>
              <div className="admin-table">
                <div className="admin-row">
                  <div>
                    <p className="admin-row-title">john@example.com</p>
                    <p className="event-copy">VIP pass · Active</p>
                  </div>
                  <div className="admin-row-meta">
                    <span className="chip">User</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'settings' ? (
            <div className="admin-list">
              <div className="admin-list-head">
                <div>
                  <p className="meta-label">Settings</p>
                  <h2>Platform preferences</h2>
                </div>
              </div>
              <div className="admin-card">
                <p className="meta-label">Payments</p>
                <p className="event-copy">
                  Payment methods configured. Update keys in the environment
                  panel.
                </p>
                <button className="button outline" type="button">
                  Manage keys
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
