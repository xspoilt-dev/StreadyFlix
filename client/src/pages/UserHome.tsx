import { useEffect, useState } from 'react'
import heroImg from '../assets/hero.png'
import PaymentModal from '../components/PaymentModal'
import { api } from '../lib/api'
import type { EventItem } from '../lib/api'

function UserHome() {
  const [event, setEvent] = useState<EventItem | null>(null)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPass, setSelectedPass] = useState({
    name: 'Finals VIP Pass',
    price: '$19.99',
  })

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const events = await api.listEvents()
        if (events.length > 0) {
          setEvent(events[0])
          setSelectedPass({
            name: events[0].pass_name,
            price: `$${events[0].pass_price.toFixed(2)}`,
          })
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load event'
        setError(message)
      }
    }

    loadEvent()
  }, [])

  const openModal = (name: string, price: string) => {
    setSelectedPass({ name, price })
    setIsModalOpen(true)
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true"></span>
            <div>
              <p className="brand-title">StreadyFlix</p>
              <p className="brand-subtitle">Premium Live Events</p>
            </div>
          </div>
          <nav className="site-nav">
            <a href="#event-details">Event</a>
            <a href="#passes">Passes</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <div className="header-actions">
            <button className="button ghost" type="button">
              Login
            </button>
            <button
              className="button primary"
              type="button"
              onClick={() => openModal('Finals VIP Pass', '$19.99')}
            >
              Get Pass
            </button>
          </div>
        </div>
      </header>

      <main>
        <section
          className="hero hero-banner"
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className="container hero-grid">
            <div className="hero-content">
              <p className="eyebrow">Live this weekend</p>
              <h1>{event?.name ?? 'Winter Clash Championship'}</h1>
              <p className="hero-subtitle">
                {event?.description ??
                  'The season finale hits with a three-stage showdown. Secure your pass and jump straight into the stream the moment it goes live.'}
              </p>
              <div className="hero-meta">
                <div>
                  <p className="meta-label">Starts</p>
                  <p className="meta-value">
                    {event
                      ? new Date(event.start_date).toLocaleString()
                      : 'Sat, Jun 01 · 18:00 UTC'}
                  </p>
                </div>
                <div>
                  <p className="meta-label">Pass</p>
                  <p className="meta-value">
                    {event
                      ? `${event.pass_name} · $${event.pass_price.toFixed(2)}`
                      : 'Finals VIP · $19.99'}
                  </p>
                </div>
                <div>
                  <p className="meta-label">Stream</p>
                  <p className="meta-value">
                    {event ? 'Primary + Backup feeds' : 'Primary + Backup feeds'}
                  </p>
                </div>
              </div>
              <div className="hero-actions">
                <button
                  className="button primary"
                  type="button"
                  onClick={() =>
                    openModal(
                      event?.pass_name ?? 'Finals VIP Pass',
                      event
                        ? `$${event.pass_price.toFixed(2)}`
                        : '$19.99',
                    )
                  }
                >
                  Buy Event Pass
                </button>
                <button className="button outline" type="button">
                  View Schedule
                </button>
              </div>
              {error ? <p className="auth-error">{error}</p> : null}
              <div className="hero-chips">
                <span className="chip live">Live</span>
                <span className="chip">HD Broadcast</span>
                <span className="chip">Instant Access</span>
                <span className="chip">Stripe + PayPal</span>
              </div>
            </div>
            <div className="hero-card">
              <p className="card-title">Next Up</p>
              <p className="card-main">Semifinals · Arena 2</p>
              <p className="card-sub">Live warmup in 00:18:32</p>
              <div className="hero-card-meta">
                <span className="chip">Doors 17:00</span>
                <span className="chip">Main 18:00</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="event-details">
          <div className="container section-head">
            <div>
              <p className="eyebrow">Event details</p>
              <h2>One event. Full focus.</h2>
            </div>
          </div>
          <div className="container details-grid">
            <div className="details-card">
              <h3>What you get</h3>
              <p className="event-copy">
                Live coverage of all three stages with a premium broadcast booth,
                halftime analysis, and instant replay moments.
              </p>
              <ul className="details-list">
                <li>Primary + backup stream URLs</li>
                <li>Full 3-hour championship coverage</li>
                <li>Instant access after payment</li>
              </ul>
            </div>
            <div className="details-card">
              <h3>Schedule</h3>
              <div className="schedule-item">
                <p className="meta-label">Warmup</p>
                <p className="meta-value">17:30 UTC</p>
              </div>
              <div className="schedule-item">
                <p className="meta-label">Main Event</p>
                <p className="meta-value">18:00 UTC</p>
              </div>
              <div className="schedule-item">
                <p className="meta-label">Post show</p>
                <p className="meta-value">20:45 UTC</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="passes">
          <div className="container section-head">
            <div>
              <p className="eyebrow">Pass options</p>
              <h2>Choose your access</h2>
            </div>
          </div>
          <div className="container pass-grid">
            <article className="pass-card">
              <div>
                <p className="meta-label">Standard</p>
                <h3>Event Pass</h3>
                <p className="event-copy">
                  Access the live event stream with full HD broadcast.
                </p>
              </div>
              <div className="pass-footer">
                <span className="chip">$14.99</span>
                <button
                  className="button outline"
                  type="button"
                  onClick={() =>
                    openModal(
                      event?.pass_name ?? 'Event Pass',
                      event
                        ? `$${event.pass_price.toFixed(2)}`
                        : '$14.99',
                    )
                  }
                >
                  Buy pass
                </button>
              </div>
            </article>
            <article className="pass-card highlight">
              <div>
                <p className="meta-label">VIP</p>
                <h3>Finals VIP Pass</h3>
                <p className="event-copy">
                  Premium angles, exclusive interviews, and priority chat.
                </p>
              </div>
              <div className="pass-footer">
                <span className="chip live">$19.99</span>
                <button
                  className="button primary"
                  type="button"
                  onClick={() =>
                    openModal(
                      event?.pass_name ?? 'Finals VIP Pass',
                      event
                        ? `$${event.pass_price.toFixed(2)}`
                        : '$19.99',
                    )
                  }
                >
                  Buy pass
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="container section-head">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>From signup to stream in minutes</h2>
            </div>
          </div>
          <div className="container steps">
            <div className="step-card">
              <p className="step-index">01</p>
              <h3>Create an account</h3>
              <p className="event-copy">
                Simple email + password signup. Auto-login on completion.
              </p>
            </div>
            <div className="step-card">
              <p className="step-index">02</p>
              <h3>Purchase an event pass</h3>
              <p className="event-copy">
                Pay securely with Stripe or PayPal. Affiliate codes apply
                instantly.
              </p>
            </div>
            <div className="step-card">
              <p className="step-index">03</p>
              <h3>Watch instantly</h3>
              <p className="event-copy">
                Redirected straight to the live player with primary and backup
                streams.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="brand-title">StreadyFlix</p>
            <p className="hero-subtitle">
              A focused streaming platform built for live event revenue.
            </p>
          </div>
          <div className="footer-links">
            <a href="#event-details">Event</a>
            <a href="#passes">Passes</a>
            <a href="#how-it-works">How it works</a>
          </div>
          <div className="footer-cta">
            <p className="meta-label">Ready to launch?</p>
            <button
              className="button primary"
              type="button"
              onClick={() => openModal('Finals VIP Pass', '$19.99')}
            >
              Buy pass
            </button>
          </div>
        </div>
      </footer>

      <PaymentModal
        isOpen={isModalOpen}
        passName={selectedPass.name}
        price={selectedPass.price}
        eventId={event?._id ?? ''}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default UserHome
