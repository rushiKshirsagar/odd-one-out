# Odd One Out — Lone Sock Marketplace

A quirky marketplace where you can only list items that are 1 out of a pair. Lost a sock? Buy one here. Have a lone sock? List it.

## Features

- List single items (one sock per listing)
- Browse available items
- Stripe payment integration
- Cash on pickup option
- Responsive layout
- Dynamic header that changes on scroll

## Tech Stack

- **Frontend**: React 18 + Vite, React Router, Stripe Elements
- **Backend**: Express.js, SQLite (better-sqlite3)
- **Payments**: Stripe

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```
   
   And in `client/.env`:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Run development servers**:
   ```bash
   npm run dev
   ```
   
   This starts:
   - Frontend at `http://localhost:5173`
   - Backend at `http://localhost:3001`

## Project Structure

```
marketplace/
├── client/          # React frontend (Vite)
├── server/          # Express backend + SQLite
│   ├── data/       # SQLite database (auto-created)
│   └── routes/     # API routes
└── package.json     # Root scripts
```

## API Endpoints

- `GET /api/items` - List all items
- `GET /api/items/:id` - Get item details
- `POST /api/items` - Create new listing
- `POST /api/orders` - Create order (cash)
- `POST /api/orders/complete` - Complete Stripe order
- `POST /api/stripe/create-payment-intent` - Create Stripe payment intent

## Production Build

```bash
npm run build
npm start
```

The server will serve the built React app and handle API routes.

## Image uploads & storage

- **Upload**: List item form accepts either a **file upload** (JPEG/PNG/GIF/WebP, max 2MB) or an **image URL**. Uploaded files are stored in `server/uploads/` and served at `/uploads/:filename`.
- **Space**: Each image is limited to 2MB. Rough ballpark: 500 items × ~500KB ≈ 250MB. For larger scale, add resize/compression (e.g. `sharp`) or move to object storage.
- **Ways to handle data**:
  - **Current (on-server disk)**: Simple, no extra services; backups should include `server/uploads/`. Fits single-server + SQLite.
  - **Resize/compress**: Add a step (e.g. `sharp`) to save thumbnails + medium size to cut disk use and bandwidth.
  - **Object storage (S3, R2, Cloudinary)**: Upload to a bucket, store only the URL in the DB; better for multiple servers and scaling.
  - **External URLs only**: Keep “paste URL” only and don’t store files (no disk use, depends on external hosts).

## Notes

- SQLite database is created automatically in `server/data/`
- Uploads directory `server/uploads/` is created on first upload
- Stripe keys are required for payment processing (use test keys for development)
- The "washed before listing" checkbox is required on the form
- **Seed data**: If the items table is empty, the server seeds 3 dummy products on startup. To re-seed, delete `server/data/marketplace.db` and restart, or run `cd server && npm run seed` (seed script only runs when the table is empty)

