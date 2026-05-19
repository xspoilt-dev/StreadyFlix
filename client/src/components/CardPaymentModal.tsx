import { useEffect, useState } from 'react'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { api } from '../lib/api'

type CardPaymentModalProps = {
  isOpen: boolean
  clientSecret: string
  paymentIntentId: string
  amountLabel: string
  onClose: () => void
  onSuccess: () => void
}

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
)

function CardPaymentForm({
  clientSecret,
  paymentIntentId,
  amountLabel,
  onClose,
  onSuccess,
}: Omit<CardPaymentModalProps, 'isOpen'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return
    }
    setIsSubmitting(true)
    setError('')

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Payment form is not ready')
      setIsSubmitting(false)
      return
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    })

    if (result.error) {
      setError(result.error.message ?? 'Payment failed')
      setIsSubmitting(false)
      return
    }

    if (result.paymentIntent?.status === 'succeeded') {
      await api.verifyPayment({
        provider: 'card',
        payment_intent_id: paymentIntentId,
      })
      onSuccess()
    }

    setIsSubmitting(false)
  }

  return (
    <form className="modal-body" onSubmit={handleSubmit}>
      <p className="modal-price">{amountLabel}</p>
      <CardElement className="card-element" />
      {error ? <p className="auth-error">{error}</p> : null}
      <div className="modal-actions">
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Pay now'}
        </button>
        <button className="button outline" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function CardPaymentModal({
  isOpen,
  clientSecret,
  paymentIntentId,
  amountLabel,
  onClose,
  onSuccess,
}: CardPaymentModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-payment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="meta-label">Card payment</p>
            <h3 id="card-payment-title">Enter card details</h3>
          </div>
          <button className="button ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CardPaymentForm
            clientSecret={clientSecret}
            paymentIntentId={paymentIntentId}
            amountLabel={amountLabel}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  )
}

export default CardPaymentModal
