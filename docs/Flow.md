# Streaming Website Flow

Simple streaming platform where users purchase access to live events and instantly watch streams.

---

# 1. Main Goal

Keep the website extremely simple:

- Admin creates events
- Users sign up
- Users purchase event access
- Users instantly redirected to player
- Admin manages everything from one dashboard
- Affiliates earn commission from purchases

No complicated vendor system.
No affiliate dashboard.
No unnecessary pages.

---

# 2. Roles

## Admin

Can:

- Create events
- Upload thumbnails
- Add stream URLs
- View users
- View purchases
- View payments
- Create affiliates
- Generate affiliate links
- Set affiliate commission %
- See affiliate balances

---

## User

Can:

- Sign up
- Login
- Browse events
- Purchase event pass
- Watch purchased events

---

# 3. Event Structure

Each event contains:

| Field | Type |
|---|---|
| id | UUID |
| name | String |
| description | Text |
| thumbnail | Image |
| start_date | DateTime |
| end_date | DateTime |
| stream_url_primary | URL |
| stream_url_backup | URL |
| pass_name | String |
| pass_price | Number |
| status | Draft / Live / Ended |

---

# 4. User Authentication

Simple email/password auth.

## Signup Fields

- Full Name
- Email
- Password

After signup:
- Auto login
- Redirect to homepage

---

# 5. Affiliate System

## Admin Creates Affiliate

Admin enters:

- Affiliate name
- Commission %
- Optional notes

System generates:

- Affiliate code
- Affiliate tracking link

Example:

```txt
https://site.com/?ref=AFF123
```

# 6. Payment Gateway

Payment Gateway :
    - Stripe 
    - Paypal 
    

