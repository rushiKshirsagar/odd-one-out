/**
 * Seed dummy products. Run once: node seed.js
 * Inserts a few items only if the items table is empty.
 */
import db from './db.js'

const count = db.prepare('SELECT COUNT(*) as n FROM items').get()
if (count.n > 0) {
  console.log('Items already exist, skipping seed.')
  process.exit(0)
}

const items = [
  {
    title: 'Blue striped ankle sock (left)',
    description: 'Survived the dryer. Slight fuzz on the heel. Fits US 8–10.',
    price_cents: 199,
    image_url: null,
    category: 'sock',
  },
  {
    title: 'Single black wireless earbud',
    description: 'Right side only. Holds charge. The left one went through the wash.',
    price_cents: 1299,
    image_url: null,
    category: 'earbud',
  },
  {
    title: 'Red winter glove, right hand',
    description: 'Wool blend. Lost its pair on the bus. Clean.',
    price_cents: 499,
    image_url: null,
    category: 'glove',
  },
]

const insert = db.prepare(`
  INSERT INTO items (title, description, price_cents, image_url, category)
  VALUES (?, ?, ?, ?, ?)
`)

for (const item of items) {
  insert.run(item.title, item.description, item.price_cents, item.image_url, item.category)
}

console.log(`Seeded ${items.length} dummy products.`)
process.exit(0)
