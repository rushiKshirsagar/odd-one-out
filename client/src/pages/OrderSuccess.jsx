import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CategoryIcon from '../components/CategoryIcon'
import styles from './OrderSuccess.module.css'

const API = '/api'

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const paymentIntent = params.get('payment_intent')
  const [completedOrderId, setCompletedOrderId] = useState(orderId)

  useEffect(() => {
    if (!paymentIntent) return
    fetch(`${API}/orders/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_intent_id: paymentIntent }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((order) => setCompletedOrderId(String(order.id)))
      .catch(() => {})
  }, [paymentIntent])

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <span className={styles.icon}><CategoryIcon category="other" size={48} /></span>
        <h1>You did it.</h1>
        <p>Your lone item is on its way to a new home. (Or you’re paying cash when you pick it up. Either way—nice.)</p>
        {(completedOrderId || orderId) && <p className={styles.orderId}>Order #{completedOrderId || orderId}</p>}
        <Link to="/browse" className={styles.cta}>Browse more items</Link>
      </div>
    </div>
  )
}
