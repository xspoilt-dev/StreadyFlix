import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { PaymentGateway } from '../lib/api'

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
  const [gateways, setGateways] = useState<PaymentGateway[]>([])
  const [redirectUrl, setRedirectUrl] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const loadGateways = async () => {
      try {
        const data = await api.listPaymentGateways()
        setGateways(data.filter((gateway) => gateway.enabled))
      } catch (gatewayError) {
        const message =
          gatewayError instanceof Error
            ? gatewayError.message
            : 'Unable to load payment methods'
        setError(message)
      }
    }

    loadGateways()
  }, [isOpen])

  useEffect(() => {
    if (!redirectUrl) {
      return
    }
    window.location.assign(redirectUrl)
  }, [redirectUrl])

  if (!isOpen) {
    return null
  }

  const handleCheckout = async (provider: 'card' | 'paypal') => {
    try {
      setIsLoading(true)
      setError('')
      const userId = window.localStorage.getItem('sf_user_id')
      if (!userId) {
        setError('Please login to continue with payment.')
        return
      }
      const response = await api.createPayment(provider, {
        event_id: eventId,
        user_id: userId,
      })
      if (eventId) {
        window.localStorage.setItem('sf_user_pass_event', eventId)
      }
      setRedirectUrl(response.url)
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
            Secure payment and instant access. After purchase, you are
            redirected straight into the live player.
          </p>
          {error ? <p className="auth-error">{error}</p> : null}
          <div className="modal-actions">
            {gateways.length === 0 ? (
              <button className="button outline" type="button" disabled>
                No payment methods available
              </button>
            ) : (
              gateways.map((gateway, index) => (
                <button
                  key={gateway.id}
                  className={`button ${index === 0 ? 'primary' : 'outline'}`}
                  type="button"
                  onClick={() => handleCheckout(gateway.id)}
                  disabled={isLoading}
                >
                  Continue with {gateway.label}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
