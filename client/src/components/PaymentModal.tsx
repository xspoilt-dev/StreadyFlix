import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { PaymentGateway } from '../lib/api'
import CardPaymentModal from './CardPaymentModal'

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
  const [cardClientSecret, setCardClientSecret] = useState('')
  const [cardIntentId, setCardIntentId] = useState('')
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)

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
      if (provider === 'card') {
        const intent = await api.createCardIntent({
          event_id: eventId,
          user_id: userId,
        })
        if (!intent.client_secret) {
          throw new Error('Payment setup failed')
        }
        if (eventId) {
          window.localStorage.setItem('sf_user_pass_event', eventId)
        }
        setCardClientSecret(intent.client_secret)
        setCardIntentId(intent.payment_intent_id)
        setIsCardModalOpen(true)
      } else {
        const response = await api.createPayment(provider, {
          event_id: eventId,
          user_id: userId,
        })
        if (eventId) {
          window.localStorage.setItem('sf_user_pass_event', eventId)
        }
        setRedirectUrl(response.url)
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
    <>
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
      <CardPaymentModal
        isOpen={isCardModalOpen}
        clientSecret={cardClientSecret}
        paymentIntentId={cardIntentId}
        amountLabel={price}
        onClose={() => setIsCardModalOpen(false)}
        onSuccess={() => {
          setIsCardModalOpen(false)
          window.location.href = '/player'
        }}
      />
    </>
  )
}

export default PaymentModal
