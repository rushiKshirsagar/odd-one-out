import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../components/CheckoutForm'
import CategoryIcon from '../components/CategoryIcon'
import styles from './Checkout.module.css'

const API = '/api'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash') // 'cash' only for now; 'stripe' coming soon
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`${API}/items/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Not found'))))
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (paymentMethod !== 'stripe' || !item) {
      setClientSecret('')
      return
    }
    let cancelled = false
    fetch(`${API}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: item.id, amount_cents: item.price_cents }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to create payment'))))
      .then((data) => { if (!cancelled) setClientSecret(data.clientSecret) })
      .catch(() => { if (!cancelled) setClientSecret('') })
    return () => { cancelled = true }
  }, [paymentMethod, item])

  if (loading) {
    return (
      <div className={styles.wrap}>
        <p className={styles.muted}>Loading...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className={styles.wrap}>
        <p className={styles.error}>Item not found.</p>
        <button type="button" onClick={() => navigate('/browse')}>Back to browse</button>
      </div>
    )
  }

  if (item.sold) {
    return (
      <div className={styles.wrap}>
        <p className={styles.error}>This item has already been purchased.</p>
        <button type="button" onClick={() => navigate('/browse')}>Back to browse</button>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1>Checkout</h1>
        <p className={styles.subtitle}>Almost there. One item, one payment.</p>
      </header>

      <div className={styles.summary}>
        <div className={styles.summaryMedia}>
          {item.image_url ? (
            <img src={item.image_url} alt="" />
          ) : (
            <CategoryIcon category={item.category} size={36} />
          )}
        </div>
        <div className={styles.summaryBody}>
          <h2>{item.title}</h2>
          <p className={styles.price}>${(item.price_cents / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={styles.tabDisabled}
          disabled
          title="Coming soon"
        >
          Card (Stripe) — Coming soon
        </button>
        <button
          type="button"
          className={paymentMethod === 'cash' ? styles.active : ''}
          onClick={() => setPaymentMethod('cash')}
        >
          Cash on pickup
        </button>
      </div>

      {paymentMethod === 'cash' ? (
        <div className={styles.cashSection}>
          {item.location && (
            <p className={styles.pickupLocation}>Pickup area: {item.location}</p>
          )}
          {item.phone && (
            <p className={styles.pickupLocation}>Seller phone: {item.phone}</p>
          )}
          <p>You’ll pay when you pick up the item. Use the details above to arrange pickup.</p>
          <button
            type="button"
            className={styles.submit}
            onClick={async () => {
              try {
                const res = await fetch(`${API}/orders`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    item_id: item.id,
                    payment_method: 'cash',
                  }),
                })
                if (!res.ok) throw new Error('Failed to create order')
                const order = await res.json()
                navigate(`/order/success?order=${order.id}`)
              } catch (e) {
                alert(e.message || 'Something went wrong.')
              }
            }}
          >
            Confirm — Cash on pickup
          </button>
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm item={item} clientSecret={clientSecret} onSuccess={() => navigate('/order/success')} />
        </Elements>
      ) : (
        <p className={styles.muted}>Preparing payment form...</p>
      )}
    </div>
  )
}
