import { useState } from 'react'
import type { EventItem } from '../lib/api'

type AdminEventModalProps = {
  isOpen: boolean
  event?: EventItem | null
  onClose: () => void
  onSave: (payload: Partial<EventItem>) => Promise<void>
}

const emptyEvent: Partial<EventItem> = {
  name: '',
  description: '',
  thumbnail: '',
  start_date: '',
  end_date: '',
  stream_url_primary: '',
  stream_url_backup: '',
  pass_name: '',
  pass_price: 0,
  status: 'Draft',
}

function AdminEventModal({ isOpen, event, onClose, onSave }: AdminEventModalProps) {
  const initialForm = event ? { ...event } : emptyEvent
  const [form, setForm] = useState<Partial<EventItem>>(initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) {
    return null
  }

  const updateField = (key: keyof EventItem, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (eventSubmit: React.FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : 'Unable to save event'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-event-title"
        onClick={(eventClick) => eventClick.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="meta-label">Event</p>
            <h3 id="admin-event-title">
              {event ? 'Edit event' : 'Create event'}
            </h3>
          </div>
          <button className="button ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="auth-field">
              <span>Name</span>
              <input
                type="text"
                value={form.name ?? ''}
                onChange={(eventInput) =>
                  updateField('name', eventInput.target.value)
                }
                required
              />
            </label>
            <label className="auth-field">
              <span>Status</span>
              <select
                value={form.status ?? 'Draft'}
                onChange={(eventInput) =>
                  updateField('status', eventInput.target.value)
                }
              >
                <option value="Draft">Draft</option>
                <option value="Live">Live</option>
                <option value="Ended">Ended</option>
              </select>
            </label>
            <label className="auth-field admin-form-span">
              <span>Description</span>
              <textarea
                value={form.description ?? ''}
                onChange={(eventInput) =>
                  updateField('description', eventInput.target.value)
                }
                rows={4}
              ></textarea>
            </label>
            <label className="auth-field admin-form-span">
              <span>Thumbnail URL</span>
              <input
                type="url"
                value={form.thumbnail ?? ''}
                onChange={(eventInput) =>
                  updateField('thumbnail', eventInput.target.value)
                }
              />
            </label>
            <label className="auth-field">
              <span>Start date</span>
              <input
                type="datetime-local"
                value={form.start_date ? form.start_date.slice(0, 16) : ''}
                onChange={(eventInput) =>
                  updateField('start_date', eventInput.target.value)
                }
              />
            </label>
            <label className="auth-field">
              <span>End date</span>
              <input
                type="datetime-local"
                value={form.end_date ? form.end_date.slice(0, 16) : ''}
                onChange={(eventInput) =>
                  updateField('end_date', eventInput.target.value)
                }
              />
            </label>
            <label className="auth-field">
              <span>Pass name</span>
              <input
                type="text"
                value={form.pass_name ?? ''}
                onChange={(eventInput) =>
                  updateField('pass_name', eventInput.target.value)
                }
                required
              />
            </label>
            <label className="auth-field">
              <span>Pass price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.pass_price ?? 0}
                onChange={(eventInput) =>
                  updateField('pass_price', Number(eventInput.target.value))
                }
                required
              />
            </label>
            <label className="auth-field admin-form-span">
              <span>Primary stream URL</span>
              <input
                type="url"
                value={form.stream_url_primary ?? ''}
                onChange={(eventInput) =>
                  updateField('stream_url_primary', eventInput.target.value)
                }
              />
            </label>
            <label className="auth-field admin-form-span">
              <span>Backup stream URL</span>
              <input
                type="url"
                value={form.stream_url_backup ?? ''}
                onChange={(eventInput) =>
                  updateField('stream_url_backup', eventInput.target.value)
                }
              />
            </label>
          </div>
          {error ? <p className="auth-error">{error}</p> : null}
          <div className="modal-actions">
            <button className="button primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminEventModal
