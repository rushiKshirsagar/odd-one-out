import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCategoryLabel } from '../lib/categories'
import CategoryIcon from '../components/CategoryIcon'
import styles from './ItemDetail.module.css'

const API = '/api'

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    fetch(`${API}/items/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Not found'))))
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

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
        <p className={styles.error}>Item not found. (It might have hopped into another dimension.)</p>
        <Link to="/browse">Back to browse</Link>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.layout}>
        <div className={styles.media}>
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} />
          ) : (
            <div className={styles.placeholder}><CategoryIcon category={item.category} size={80} /></div>
          )}
        </div>
        <div className={styles.main}>
          <span className={styles.category}>{getCategoryLabel(item.category)}</span>
          <h1>{item.title}</h1>
          <p className={styles.price}>${(item.price_cents / 100).toFixed(2)}</p>
          <p className={styles.desc}>{item.description}</p>
          <p className={styles.note}>Clean before listing. We checked. (We didn’t, but they said so.)</p>
          {item.sold ? (
            <p className={styles.sold}>This item has been purchased.</p>
          ) : (
            <Link to={`/checkout/${item.id}`} className={styles.buy}>
              Buy this item
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
