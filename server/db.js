import Database from 'better-sqlite3'
import { mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, 'data')
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
const dbPath = join(dataDir, 'marketplace.db')

const db = new Database(dbPath)

// Tables and order indexes first
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    image_url TEXT,
    category TEXT DEFAULT 'other',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (item_id) REFERENCES items(id)
  );

  CREATE INDEX IF NOT EXISTS idx_orders_item ON orders(item_id);
  CREATE INDEX IF NOT EXISTS idx_orders_stripe ON orders(stripe_payment_intent_id);
`)

// Add category to items if DB was created before we added this column
try {
  db.exec(`ALTER TABLE items ADD COLUMN category TEXT DEFAULT 'other'`)
} catch (_) {}

// Now safe to index category
db.exec(`CREATE INDEX IF NOT EXISTS idx_items_category ON items(category)`)

try {
  db.exec(`ALTER TABLE items ADD COLUMN location TEXT`)
} catch (_) {}

try {
  db.exec(`ALTER TABLE items ADD COLUMN phone TEXT`)
} catch (_) {}

export default db
