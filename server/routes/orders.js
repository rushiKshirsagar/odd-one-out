import { Router } from 'express'
import Stripe from 'stripe'
import db from '../db.js'

const router = Router()
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

router.get('/:id', (req, res) => {
  const id = req.params.id
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const item = db.prepare('SELECT id, title, phone, location FROM items WHERE id = ?').get(order.item_id)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  res.json({ ...order, item: { title: item.title, phone: item.phone, location: item.location } })
})

router.post('/', (req, res) => {
  const { item_id, payment_method } = req.body
  if (!item_id || !payment_method) {
    return res.status(400).json({ error: 'Missing item_id or payment_method' })
  }
  const item = db.prepare('SELECT id FROM items WHERE id = ?').get(item_id)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  if (payment_method !== 'cash' && payment_method !== 'stripe') {
    return res.status(400).json({ error: 'Invalid payment_method' })
  }
  const status = payment_method === 'cash' ? 'cash_pending' : 'pending'
  const result = db.prepare(`
    INSERT INTO orders (item_id, payment_method, status)
    VALUES (?, ?, ?)
  `).run(item_id, payment_method, status)
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(order)
})

router.post('/complete', async (req, res) => {
  const { payment_intent_id } = req.body
  if (!payment_intent_id || !stripe) {
    return res.status(400).json({ error: 'Missing payment_intent_id or Stripe not configured' })
  }
  try {
    const pi = await stripe.paymentIntents.retrieve(payment_intent_id)
    if (pi.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' })
    }
    const itemId = pi.metadata?.item_id
    if (!itemId) return res.status(400).json({ error: 'Invalid payment intent' })
    const existing = db.prepare('SELECT id FROM orders WHERE stripe_payment_intent_id = ?').get(payment_intent_id)
    if (existing) {
      return res.json(db.prepare('SELECT * FROM orders WHERE id = ?').get(existing.id))
    }
    const result = db.prepare(`
      INSERT INTO orders (item_id, payment_method, status, stripe_payment_intent_id)
      VALUES (?, 'stripe', 'paid', ?)
    `).run(itemId, payment_intent_id)
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid)
    res.json(order)
  } catch (e) {
    res.status(400).json({ error: e.message || 'Failed to complete order' })
  }
})

export default router
