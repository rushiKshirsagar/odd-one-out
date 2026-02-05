import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, getCategoryLabel } from '../lib/categories'
import CategoryIcon from '../components/CategoryIcon'
import styles from './Browse.module.css'

const API = '/api'

export default function Browse() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const url = categoryFilter ? `${API}/items?category=${encodeURIComponent(categoryFilter)}` : `${API}/items`
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to load'))))
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [categoryFilter])

  if (loading) {
    return (
      <div className={styles.wrap}>
        <p className={styles.muted}>Finding lone items...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.wrap}>
        <p className={styles.error}>Couldn’t load items. (The dryer might have eaten the cable.)</p>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1>Browse</h1>
        <p className={styles.subtitle}>One item per listing. No pairs. We mean it.</p>
        <div className={styles.filters}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {CATEGORIES.filter((c) => c.value !== 'other').map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
            <option value="other">Other</option>
          </select>
        </div>
      </header>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>No lone items listed yet.</p>
          <Link to="/list">Be the first to list one →</Link>
        </div>
      ) : (
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/item/${item.id}`} className={styles.card}>
                <div className={styles.imgWrap}>
                  {item.image_url ? (
                    <img src={item.image_url} alt="" />
                  ) : (
                    <span className={styles.placeholder}><CategoryIcon category={item.category} size={64} /></span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  {item.sold && <span className={styles.soldBadge}>Purchased</span>}
                  <span className={styles.category}>{getCategoryLabel(item.category)}</span>
                  <h3>{item.title}</h3>
                  <p className={styles.price}>${(item.price_cents / 100).toFixed(2)}</p>
                  <p className={styles.desc}>{(item.description || '').slice(0, 60)}{(item.description || '').length > 60 ? '…' : ''}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
