import { Router } from 'express'
import Stripe from 'stripe'
import db from '../db.js'

const router = Router()
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

router.post('/create-payment-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' })
  }
  const { item_id, amount_cents } = req.body
  if (!item_id || typeof amount_cents !== 'number' || amount_cents < 50) {
    return res.status(400).json({ error: 'Invalid item_id or amount' })
  }
  const item = db.prepare('SELECT id, title FROM items WHERE id = ?').get(item_id)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount_cents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { item_id: String(item_id) },
      description: `Odd One Out: ${item.title}`,
    })
    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Stripe error' })
  }
})

export default router
