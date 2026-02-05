import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './db.js'
import stripeRouter from './routes/stripe.js'
import itemsRouter from './routes/items.js'
import ordersRouter from './routes/orders.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

app.use(cors({ origin: isProd ? undefined : ['http://localhost:5173'], credentials: true }))
app.use(express.json())

// Serve uploaded images (dev and prod)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/items', itemsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/stripe', stripeRouter)

if (isProd) {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist')
  app.use(express.static(clientBuild))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'))
  })
}

// Seed dummy products if DB is empty
try {
  const n = db.prepare('SELECT COUNT(*) as n FROM items').get().n
  if (n === 0) {
    const items = [
      ['Blue striped ankle sock (left)', 'Survived the dryer. Slight fuzz on the heel. Fits US 8–10.', 199, null, 'sock'],
      ['Single black wireless earbud', 'Right side only. Holds charge. The left one went through the wash.', 1299, null, 'earbud'],
      ['Red winter glove, right hand', 'Wool blend. Lost its pair on the bus. Clean.', 499, null, 'glove'],
    ]
    const stmt = db.prepare('INSERT INTO items (title, description, price_cents, image_url, category) VALUES (?, ?, ?, ?, ?)')
    for (const row of items) stmt.run(...row)
    console.log('Seeded 3 dummy products.')
  }
} catch (_) {}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
