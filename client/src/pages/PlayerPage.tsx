import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { EventItem } from '../lib/api'

function PlayerPage() {
  const [event, setEvent] = useState<EventItem | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const events = await api.listEvents()
        if (events.length > 0) {
          setEvent(events[0])
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

  return (
    <div className="player-page">
      <header className="player-header">
        <div className="container player-header-inner">
          <div>
            <p className="meta-label">Live player</p>
            <h1>{event?.name ?? 'Winter Clash Championship'}</h1>
          </div>
          <div className="player-actions">
            <span className="chip live">Live</span>
            <button className="button outline" type="button">
              Backup stream
            </button>
            <button className="button ghost" type="button">
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="section">
        <div className="container player-grid">
          <div className="player-video">
            <div className="video-placeholder">
              <p>
                {error
                  ? error
                  : event
                    ? 'Live stream loading...'
                    : 'Loading event...'}
              </p>
            </div>
            <div className="video-footer">
              <span className="chip">HD</span>
              <span className="chip">Primary feed</span>
              <span className="chip">Auto-reconnect</span>
            </div>
          </div>
          <aside className="player-panel">
            <h3>Event rundown</h3>
            <p className="event-copy">
              Stay in the player. We will keep the stream stable and auto-switch
              to backup if needed.
            </p>
            <div className="schedule-item">
              <p className="meta-label">Now playing</p>
              <p className="meta-value">Main event · Round 2</p>
            </div>
            <div className="schedule-item">
              <p className="meta-label">Next</p>
              <p className="meta-value">Finals · Arena 1</p>
            </div>
            <button className="button primary" type="button">
              Refresh stream
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default PlayerPage
