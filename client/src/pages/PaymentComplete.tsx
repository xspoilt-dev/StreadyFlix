import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

function PaymentComplete() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState('')

  useEffect(() => {
    const verify = async () => {
      const sessionId = searchParams.get('session_id')
      const orderId = searchParams.get('order_id')

      if (!sessionId && !orderId) {
        setStatus('error')
        setError('No session or order ID found in URL.')
        return
      }

      try {
        const provider = sessionId ? 'card' : 'paypal'
        const response = await api.verifyPayment({
          provider,
          session_id: sessionId ?? undefined,
          order_id: orderId ?? undefined,
        })

        if (response.success) {
          setStatus('success')
          // Refresh user profile and purchases
          const token = window.localStorage.getItem('sf_user_token')
          if (token) {
            const meData = await api.getMe(token)
            window.localStorage.setItem('sf_user_id', meData.user.id)
            const events = await api.listEvents()
            if (events.length > 0) {
              const activeEvent = events[0]
              if (meData.purchases.includes(activeEvent._id)) {
                window.localStorage.setItem('sf_user_pass_event', activeEvent._id)
              }
            }
          }
          setTimeout(() => {
            navigate('/player')
          }, 1500)
        } else {
          setStatus('error')
          setError('Payment verification failed.')
        }
      } catch (verifyError) {
        setStatus('error')
        const message =
          verifyError instanceof Error
            ? verifyError.message
            : 'Payment verification failed'
        setError(message)
      }
    }

    verify()
  }, [searchParams, navigate])

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <p className="eyebrow">Checkout</p>
            <h1>Verifying Payment...</h1>
            <p className="hero-subtitle">Please wait while we secure your access.</p>
            <div className="spinner" style={{ margin: '2rem auto' }}></div>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="eyebrow" style={{ color: '#10b981' }}>Success</p>
            <h1>Payment Confirmed!</h1>
            <p className="hero-subtitle">Redirecting you to the live player...</p>
            <button className="button primary" onClick={() => navigate('/player')} style={{ marginTop: '1.5rem' }}>
              Watch now
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="eyebrow" style={{ color: '#ef4444' }}>Error</p>
            <h1>Verification Failed</h1>
            <p className="hero-subtitle">{error}</p>
            <button className="button outline" onClick={() => navigate('/')} style={{ marginTop: '1.5rem' }}>
              Back to home
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentComplete
