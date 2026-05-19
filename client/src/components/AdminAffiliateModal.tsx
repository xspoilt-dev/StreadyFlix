import { useState } from 'react'
import { api } from '../lib/api'
import type { AffiliateItem } from '../lib/api'

type AdminAffiliateModalProps = {
  isOpen: boolean
  token: string
  onClose: () => void
  onCreated: (affiliate: AffiliateItem) => void
}

function AdminAffiliateModal({
  isOpen,
  token,
  onClose,
  onCreated,
}: AdminAffiliateModalProps) {
  const [name, setName] = useState('')
  const [commission, setCommission] = useState(20)
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      const response = await api.createAffiliate(
        { name, commission_percent: commission, notes },
        token,
      )
      onCreated(response.affiliate)
      onClose()
    } catch (createError) {
      const message =
        createError instanceof Error ? createError.message : 'Unable to create'
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
        aria-labelledby="affiliate-title"
        onClick={(eventClick) => eventClick.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="meta-label">Affiliate</p>
            <h3 id="affiliate-title">Create affiliate</h3>
          </div>
          <button className="button ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(eventInput) => setName(eventInput.target.value)}
              required
            />
          </label>
          <label className="auth-field">
            <span>Commission %</span>
            <input
              type="number"
              min="0"
              max="100"
              value={commission}
              onChange={(eventInput) => setCommission(Number(eventInput.target.value))}
              required
            />
          </label>
          <label className="auth-field">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(eventInput) => setNotes(eventInput.target.value)}
              rows={3}
            ></textarea>
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <div className="modal-actions">
            <button className="button primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Creating...' : 'Create affiliate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminAffiliateModal
