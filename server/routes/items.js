import { Router } from 'express'
import db from '../db.js'
import { singleImage } from '../upload.js'

const router = Router()

const itemColumns = 'id, title, description, price_cents, image_url, category, location, created_at'
const soldSubquery = `EXISTS (SELECT 1 FROM orders o WHERE o.item_id = items.id AND o.status IN ('paid', 'cash_pending'))`

router.get('/', (req, res) => {
  const { category } = req.query
  let sql = `
    SELECT ${itemColumns}, (${soldSubquery}) AS sold
    FROM items
  `
  const params = []
  if (category) {
    sql += ` WHERE category = ?`
    params.push(category)
  }
  sql += ` ORDER BY created_at DESC`
  const rows = db.prepare(sql).all(...params)
  res.json(rows.map((r) => ({ ...r, sold: Boolean(r.sold) })))
})

router.get('/categories', (req, res) => {
  const rows = db.prepare(`SELECT DISTINCT category FROM items WHERE category IS NOT NULL ORDER BY category`).all()
  res.json(rows.map((r) => r.category))
})

router.get('/:id', (req, res) => {
  const row = db.prepare(`
    SELECT ${itemColumns}, (${soldSubquery}) AS sold
    FROM items WHERE id = ?
  `).get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Item not found' })
  res.json({ ...row, sold: Boolean(row.sold) })
})

// JSON body (no file)
function createFromJson(req, res) {
  const { title, description, price_cents, image_url, category, location } = req.body
  if (!title || typeof price_cents !== 'number' || price_cents < 1) {
    return res.status(400).json({ error: 'Invalid title or price' })
  }
  const cat = category && typeof category === 'string' ? category.trim().toLowerCase() || 'other' : 'other'
  const loc = location && typeof location === 'string' ? location.trim() || null : null
  const result = db.prepare(`
    INSERT INTO items (title, description, price_cents, image_url, category, location)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, description || null, price_cents, image_url || null, cat, loc)
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(item)
}

// Multipart (optional file upload)
function createFromMultipart(req, res) {
  const { title, description, price_cents, category, image_url: urlField, location } = req.body
  const price = parseInt(price_cents, 10)
  if (!title || !price_cents || isNaN(price) || price < 1) {
    return res.status(400).json({ error: 'Invalid title or price' })
  }
  const cat = category && typeof category === 'string' ? category.trim().toLowerCase() || 'other' : 'other'
  const image_url = req.file ? `/uploads/${req.file.filename}` : (urlField && urlField.trim()) || null
  const loc = location && typeof location === 'string' ? location.trim() || null : null
  const result = db.prepare(`
    INSERT INTO items (title, description, price_cents, image_url, category, location)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title.trim(), (description && description.trim()) || null, price, image_url, cat, loc)
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(item)
}

router.post('/', (req, res, next) => {
  const contentType = req.headers['content-type'] || ''
  if (contentType.includes('multipart/form-data')) {
    singleImage(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Invalid file (max 2MB, images only)' })
      createFromMultipart(req, res)
    })
  } else {
    createFromJson(req, res)
  }
})

export default router
