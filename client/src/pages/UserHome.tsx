import { useEffect, useState } from 'react'
import heroImg from '../assets/hero.png'
import AuthModal from '../components/AuthModal'
import PassSelectionModal from '../components/PassSelectionModal'
import PaymentModal from '../components/PaymentModal'
import { api } from '../lib/api'
import type { EventItem } from '../lib/api'

function UserHome() {
  const [event, setEvent] = useState<EventItem | null>(null)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')
  const [pendingCheckout, setPendingCheckout] = useState(false)
  const [isPassSelectOpen, setIsPassSelectOpen] = useState(false)
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

  const passOptions = event
    ? [
        {
          name: event.pass_name,
          price: `$${event.pass_price.toFixed(2)}`,
        },
      ]
    : []

  const openModal = (name: string, price: string) => {
    setSelectedPass({ name, price })
    setIsModalOpen(true)
  }

  const openPassModal = () => {
    const userId = window.localStorage.getItem('sf_user_id')
    if (!userId) {
      setAuthMode('signup')
      setPendingCheckout(true)
      setIsAuthOpen(true)
      return
    }
    if (passOptions.length > 1) {
      setIsPassSelectOpen(true)
      return
    }
    const firstPass = passOptions[0]
    openModal(firstPass.name, firstPass.price)
  }

  const handleSchedule = () => {
    document.getElementById('event-details')?.scrollIntoView({
      behavior: 'smooth',
    })
    setIsNavOpen(false)
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
          <button
            className="user-toggle"
            type="button"
            aria-label="Toggle site menu"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`site-nav ${isNavOpen ? 'is-open' : ''}`}>
            <a href="#event-details">Event</a>
            <a href="#passes">Passes</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <div className="header-actions">
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                setAuthMode('login')
                setIsAuthOpen(true)
              }}
            >
              Login
            </button>
            <button
              className="button primary"
              type="button"
              onClick={openPassModal}
            >
              Get Pass
            </button>
          </div>
        </div>
      </header>

      <main>
        <section
          className="hero hero-banner"
          style={{
            backgroundImage: `url(${event?.thumbnail ?? heroImg})`,
          }}
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
              </div>
              <div className="hero-actions">
                <button
                  className="button primary"
                  type="button"
                  onClick={openPassModal}
                >
                  Buy Event Pass
                </button>
                <button
                  className="button outline"
                  type="button"
                  onClick={handleSchedule}
                >
                  View Schedule
                </button>
              </div>
              {error ? <p className="auth-error">{error}</p> : null}
              <div className="hero-chips">
                <span className="chip live">Live</span>
                <span className="chip">HD Broadcast</span>
                <span className="chip">Instant Access</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="event-details">
          <div className="container section-head">
            <div>
              <p className="eyebrow">Event details</p>
              <h2>Event info & schedule</h2>
            </div>
          </div>
          <div className="container details-grid">
            <div className="details-card">
              <h3>Details</h3>
              <p className="event-copy">
                Event details are managed in the admin panel and appear here for
                attendees.
              </p>
              <ul className="details-list">
                <li>Single event access</li>
                <li>Instant access after payment</li>
                <li>Live broadcast</li>
              </ul>
            </div>
            <div className="details-card">
              <h3>Schedule</h3>
              <p className="event-copy">
                Schedule details are configured by the admin team and will
                appear here.
              </p>
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
            {passOptions.length === 0 ? (
              <article className="pass-card">
                <div>
                  <p className="meta-label">Pass</p>
                  <h3>Pass details pending</h3>
                  <p className="event-copy">
                    Pass options are set by the admin team and will appear here.
                  </p>
                </div>
              </article>
            ) : (
              passOptions.map((pass, index) => (
                <article
                  key={pass.name}
                  className={`pass-card ${index === 0 ? 'highlight' : ''}`}
                >
                  <div>
                    <p className="meta-label">Pass</p>
                    <h3>{pass.name}</h3>
                    <p className="event-copy">
                      Access to the live event stream with instant entry.
                    </p>
                  </div>
                  <div className="pass-footer">
                    <span className={`chip ${index === 0 ? 'live' : ''}`}>
                      {pass.price}
                    </span>
                    <button
                      className={`button ${index === 0 ? 'primary' : 'outline'}`}
                      type="button"
                      onClick={openPassModal}
                    >
                      Buy pass
                    </button>
                  </div>
                </article>
              ))
            )}
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
                Complete a quick checkout and jump straight into the stream.
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
      <PassSelectionModal
        isOpen={isPassSelectOpen}
        passes={passOptions}
        onClose={() => setIsPassSelectOpen(false)}
        onSelect={(pass) => {
          setIsPassSelectOpen(false)
          openModal(pass.name, pass.price)
        }}
      />
      <AuthModal
        isOpen={isAuthOpen}
        defaultMode={authMode}
        onClose={() => {
          setIsAuthOpen(false)
          setPendingCheckout(false)
        }}
        onSuccess={() => {
          setIsAuthOpen(false)
          if (pendingCheckout) {
            setPendingCheckout(false)
            openPassModal()
          }
        }}
      />
    </div>
  )
}

export default UserHome
