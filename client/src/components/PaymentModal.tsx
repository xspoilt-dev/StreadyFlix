import { useState } from 'react'
import { api } from '../lib/api'

type PaymentModalProps = {
  isOpen: boolean
  passName: string
  price: string
  eventId: string
  onClose: () => void
}

function PaymentModal({
  isOpen,
  passName,
  price,
  eventId,
  onClose,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) {
    return null
  }

  const handleCheckout = async (provider: 'stripe' | 'paypal') => {
    try {
      setIsLoading(true)
      setError('')
      const userId = window.localStorage.getItem('sf_user_id')
      if (!userId) {
        setError('Please login to continue with payment.')
        return
      }
      const response = await api.createCheckoutSession({
        event_id: eventId,
        user_id: userId,
      })
      if (provider === 'stripe') {
        window.location.href = response.url
      } else {
        window.location.href = response.url
      }
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error
          ? checkoutError.message
          : 'Unable to start checkout'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="meta-label">Checkout</p>
            <h3 id="payment-title">{passName}</h3>
          </div>
          <button className="button ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-price">{price}</p>
          <p className="event-copy">
            Secure payment with Stripe or PayPal. After purchase, you are
            redirected straight into the live player.
          </p>
          {error ? <p className="auth-error">{error}</p> : null}
          <div className="modal-actions">
            <button
              className="button primary"
              type="button"
              onClick={() => handleCheckout('stripe')}
              disabled={isLoading}
            >
              Continue with Stripe
            </button>
            <button
              className="button outline"
              type="button"
              onClick={() => handleCheckout('paypal')}
              disabled={isLoading}
            >
              Continue with PayPal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
