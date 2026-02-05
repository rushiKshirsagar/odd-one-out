import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import styles from './CheckoutForm.module.css'

export default function CheckoutForm({ item, clientSecret, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return
    setError('')
    setLoading(true)
    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Payment failed')
        setLoading(false)
        return
      }
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order/success`,
        },
      })
      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        setLoading(false)
        return
      }
      onSuccess()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <PaymentElement />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={!stripe || loading} className={styles.submit}>
        {loading ? 'Processing…' : `Pay $${(item.price_cents / 100).toFixed(2)}`}
      </button>
    </form>
  )
}
