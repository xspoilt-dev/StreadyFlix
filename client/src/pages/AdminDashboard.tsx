import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { AffiliateItem, EventItem } from '../lib/api'

function AdminDashboard() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([])
  const [error, setError] = useState('')

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

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-mark" aria-hidden="true"></span>
          <div>
            <p className="brand-title">StreadyFlix</p>
            <p className="brand-subtitle">Admin Suite</p>
          </div>
        </div>
        <nav className="admin-nav">
          <button className="admin-nav-item active" type="button">
            Dashboard
          </button>
          <button className="admin-nav-item" type="button">
            Events
          </button>
          <button className="admin-nav-item" type="button">
            Purchases
          </button>
          <button className="admin-nav-item" type="button">
            Affiliates
          </button>
          <button className="admin-nav-item" type="button">
            Users
          </button>
          <button className="admin-nav-item" type="button">
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
        <header className="admin-topbar">
          <div>
            <p className="meta-label">Control Panel</p>
            <h1>Event Control Center</h1>
          </div>
          <div className="header-actions">
            <button className="button ghost" type="button">
              New Event
            </button>
            <button className="button primary" type="button">
              Open Live Room
            </button>
          </div>
        </header>

        <section className="admin-content">
          <div className="admin-grid">
            <div className="admin-card">
              <p className="meta-label">Events</p>
              <h2>
                {events.filter((event) => event.status === 'Live').length} Live
                · {events.filter((event) => event.status === 'Draft').length}{' '}
                Draft
              </h2>
              <p className="event-copy">
                Manage thumbnails, stream URLs, and schedule in one place.
              </p>
              <button className="button outline" type="button">
                Manage events
              </button>
            </div>
            <div className="admin-card">
              <p className="meta-label">Purchases</p>
              <h2>$42,180</h2>
              <p className="event-copy">
                Track pass sales, refunds, and live conversions.
              </p>
              <button className="button outline" type="button">
                View payments
              </button>
            </div>
            <div className="admin-card">
              <p className="meta-label">Affiliates</p>
              <h2>{affiliates.length} Partners</h2>
              <p className="event-copy">
                Create codes, set commission, and pay out balances.
              </p>
              <button className="button outline" type="button">
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
                  <p className="event-copy">Stream healthy · 18,230 watching</p>
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
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
