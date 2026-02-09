import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../lib/categories'
import styles from './ListItem.module.css'

const API = '/api'

export default function ListItem() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [priceCents, setPriceCents] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [washed, setWashed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!washed) {
      setError('Sorry—items must be clean before listing. Wash socks, wipe earbuds, you get it.')
      return
    }
    const cents = Math.round(parseFloat(priceCents) * 100)
    if (isNaN(cents) || cents < 1) {
      setError('Please enter a valid price.')
      return
    }
    if (!title.trim()) {
      setError('Give your item a title.')
      return
    }
    if (!location.trim()) {
      setError('Please enter your area (pickup location).')
      return
    }
    if (!phone.trim()) {
      setError('Please enter your phone number.')
      return
    }
    setSubmitting(true)
    try {
      let res
      if (imageFile) {
        const form = new FormData()
        form.append('title', title.trim())
        form.append('description', description.trim())
        form.append('category', category || 'other')
        form.append('price_cents', String(cents))
        form.append('location', location.trim())
        form.append('phone', phone.trim())
        form.append('image', imageFile)
        res = await fetch(`${API}/items`, { method: 'POST', body: form })
      } else {
        res = await fetch(`${API}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            category: category || 'other',
            price_cents: cents,
            image_url: null,
            location: location.trim(),
            phone: phone.trim(),
          }),
        })
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to list item')
      }
      const item = await res.json()
      navigate(`/item/${item.id}`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1>List your orphan</h1>
        <p className={styles.subtitle}>Socks, shoes, gloves, earbuds, earrings, chopsticks & more—one item per listing. Clean before listing.</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formColumns}>
          <div className={styles.formCol}>
            <label>
              Category <span className={styles.required}>*</span>
            </label>
            <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
            <label>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blue striped sock (left), red winter glove"
              required
            />
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Condition, size, colour, backstory..."
              rows={4}
            />
            <label>Image (optional)</label>
            <div className={styles.imageOption}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <span className={styles.imageHint}>Max 2MB. JPEG, PNG, GIF, WebP.</span>
            </div>
            {imageFile && <p className={styles.fileName}>{imageFile.name}</p>}
          </div>
          <div className={styles.formCol}>
            <label>
              Price (USD) <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={priceCents}
              onChange={(e) => setPriceCents(e.target.value)}
              placeholder="0.00"
              required
            />
            <label>
              Area <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="We don't care where you live—the buyer would."
              required
            />
            <label>
              Phone number <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="We won't text you for fun—the buyer might."
              required
            />
          </div>
        </div>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={washed}
            onChange={(e) => setWashed(e.target.checked)}
          />
          <span>I confirm this item is clean (washed / wiped / presentable). We’re trusting you.</span>
        </label>
        <button type="submit" disabled={submitting} className={styles.submit}>
          {submitting ? 'Listing…' : 'List this item'}
        </button>
      </form>
    </div>
  )
}
