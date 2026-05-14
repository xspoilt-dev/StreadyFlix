# StreadyFlix

A single-event premium streaming platform built for fast event launches, instant access, and a clean admin workflow.

## Overview

StreadyFlix is designed to run one active event at a time, with a short and direct flow:

- Admin creates or activates the event
- Users sign up and purchase access
- Users are redirected to the live player
- Affiliates can generate commissions on sales

The UI and visual system follow the premium athletic streaming guidelines defined in docs/Design.md.

## Tech Stack

- Client: Astro
- Server: Hono (Bun)
- Database: MongoDB
- Payments: Stripe (PayPal planned)

## Repository Structure

```
client/   # Astro frontend
server/   # Hono backend API
docs/     # Flow, API, design system
```

## Environment Variables

Copy .env.example to .env and fill in your values.

Required values include:

- MONGO_URI
- JWT_SECRET
- STRIPE_SECRET_KEY
- PUBLIC_API_URL

## Getting Started

### 1) Backend

```bash
cd server
bun install
bun run src/index.ts
```

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

### 3) Seed Data

The seed script creates:

- Admin user
- Sample user
- Live event
- Affiliate
- Purchase

```bash
cd server
bun run seed
```

If you want to reset the database before seeding:

```bash
SEED_RESET=true bun run seed
```

## Admin Panel

The admin panel is located at:

- /admin

Admin responsibilities include:

- Create and update the single active event
- Upload thumbnails and streaming URLs
- View users, purchases, and affiliate balances

### Admin Login

Admin uses the same login system as users.

Seeded admin credentials:

- Email: admin@streadyflix.com
- Password: admin123

The admin panel should be protected by:

- JWT auth on admin API routes
- Admin role checks
- Client-side guard that redirects non-admin users

Note: The admin auth middleware and UI guard should be enabled for production.

## User Flows

### 1) Authentication

- User signs up with name, email, password
- User is auto logged in
- JWT is stored in local storage

### 2) Event Access

- User lands on the single-event homepage
- Event details are loaded from /api/events
- User clicks Get Access and is sent to checkout

### 3) Purchase

- User completes Stripe checkout
- Purchase record is saved in MongoDB

### 4) Watch

- User is redirected to /watch/:id
- Stream URL is fetched from the event
- Player renders immediately

## Affiliate Flow

- Admin creates an affiliate and gets a ref link
- User lands via ?ref=CODE
- Affiliate code is attached to purchase
- Admin sees balances in the panel

## API Overview

See docs/API.md for full endpoint specs.

Key endpoints:

- POST /api/auth/register
- POST /api/auth/login
- GET /api/events
- POST /api/events (admin)
- POST /api/payments/create-checkout-session
- POST /api/affiliates (admin)
- GET /api/admin/users (admin)
- GET /api/admin/purchases (admin)

## Production Notes

- Run MongoDB in a managed cluster or private instance
- Use HTTPS and secure cookies if moving token storage
- Enable admin-only middleware on protected routes
- Configure Stripe webhook handling for payment confirmations

## Design System

The UI references the premium athletic streaming system:

- docs/Design.md

## Documentation

- docs/Flow.md
- docs/API.md