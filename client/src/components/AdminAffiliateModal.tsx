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
  const [createdAffiliate, setCreatedAffiliate] = useState<AffiliateItem | null>(null)

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
      setCreatedAffiliate(response.affiliate)
    } catch (createError) {
      if (createError && typeof createError === 'object' && 'status' in createError) {
        const apiErr = createError as { status: number }
        if (apiErr.status === 401 || apiErr.status === 403) {
          window.localStorage.removeItem('sf_admin_authed')
          window.localStorage.removeItem('sf_admin_token')
          window.location.href = '/admin/login'
          return
        }
      }
      const message =
        createError instanceof Error ? createError.message : 'Unable to create'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFinish = () => {
    if (createdAffiliate) {
      onCreated(createdAffiliate)
    }
    // Reset state
    setName('')
    setCommission(20)
    setNotes('')
    setCreatedAffiliate(null)
    onClose()
  }

  if (createdAffiliate) {
    const affiliateLink = `${window.location.origin}/?ref=${createdAffiliate.code}`
    return (
      <div className="modal-backdrop" role="presentation" onClick={handleFinish}>
        <div
          className="modal-card admin-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="affiliate-title"
          onClick={(eventClick) => eventClick.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <p className="meta-label" style={{ color: '#10b981' }}>Success</p>
              <h3 id="affiliate-title">Affiliate Generated!</h3>
            </div>
            <button className="button ghost" type="button" onClick={handleFinish}>
              Close
            </button>
          </div>
          <div className="modal-body">
            <p className="event-copy" style={{ marginBottom: '1.5rem' }}>
              The affiliate partner has been created. You can share the code or referral link below.
            </p>

            <div className="auth-field" style={{ marginBottom: '1.25rem' }}>
              <span>Affiliate Code</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={createdAffiliate.code}
                  style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.35rem 0.5rem', color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}
                />
                <button
                  className="button primary"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(createdAffiliate.code)
                    alert('Code copied!')
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="auth-field" style={{ marginBottom: '1.5rem' }}>
              <span>Referral Link</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={affiliateLink}
                  style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.35rem 0.5rem', color: '#fff', fontSize: '0.95rem' }}
                />
                <button
                  className="button primary"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(affiliateLink)
                    alert('Link copied!')
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="button primary"
                type="button"
                onClick={handleFinish}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
