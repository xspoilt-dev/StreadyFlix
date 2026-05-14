# StreadyFlix API Documentation

Welcome to the backend API documentation for StreadyFlix. This server is built using **Hono**, **Bun**, and **MongoDB**.

## Base URL
Local Development: `http://localhost:3000`

---

## Authentication Endpoints

### 1. Register a new user
Registers a new user and returns a JWT token for auto-login.

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "strongpassword123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a7f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Login
Authenticates an existing user.

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "strongpassword123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a7f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```
*(Returns `401 Unauthorized` for invalid credentials)*

---

## Event Endpoints

### 1. List All Events
Fetches a list of all streaming events, sorted by start date.

- **URL:** `/api/events`
- **Method:** `GET`

**Success Response (200 OK):**
```json
[
  {
    "_id": "64b8c...",
    "name": "Championship Finals",
    "description": "The ultimate showdown.",
    "thumbnail": "https://example.com/thumb.jpg",
    "start_date": "2026-06-01T18:00:00Z",
    "end_date": "2026-06-01T21:00:00Z",
    "stream_url_primary": "https://stream.example.com/live1",
    "stream_url_backup": "https://stream.example.com/live2",
    "pass_name": "Finals VIP Pass",
    "pass_price": 19.99,
    "status": "Live"
  }
]
```

### 2. Get Event by ID
Fetches details of a specific event.

- **URL:** `/api/events/:id`
- **Method:** `GET`

**Success Response (200 OK):**
```json
{
  "_id": "64b8c...",
  "name": "Championship Finals",
  "description": "The ultimate showdown.",
  "pass_price": 19.99,
  "status": "Live"
}
```

### 3. Create Event (Admin)
Creates a new streaming event.

- **URL:** `/api/events`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "Summer Concert Live",
  "description": "Live music festival coverage.",
  "thumbnail": "https://example.com/concert.jpg",
  "start_date": "2026-07-15T20:00:00Z",
  "end_date": "2026-07-15T23:00:00Z",
  "pass_name": "Premium Access",
  "pass_price": 9.99,
  "status": "Draft"
}
```

**Success Response (201 Created):**
```json
{
  "_id": "64c9d...",
  "name": "Summer Concert Live"
}
```

---

## Payment Endpoints

### 1. Create Checkout Session (Stripe)
Initializes a Stripe checkout session for a specific event pass.

- **URL:** `/api/payments/create-checkout-session`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "event_id": "64b8c...",
  "user_id": "64a7f...",
  "affiliate_code": "AFF123" 
}
```
*(Note: `affiliate_code` is optional)*

**Success Response (200 OK):**
```json
{
  "id": "cs_test_a1b2c3d4...",
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4..."
}
```
*(Client should redirect to this `url` for payment)*

---

## Affiliate Endpoints

### 1. Create Affiliate (Admin)
Generates a new affiliate code and returns the tracking link.

- **URL:** `/api/affiliates`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "Jane Streamer",
  "commission_percent": 20,
  "notes": "Influencer from YouTube"
}
```

**Success Response (201 Created):**
```json
{
  "target_link": "/?ref=AFF4567",
  "affiliate": {
    "_id": "65d8e...",
    "name": "Jane Streamer",
    "code": "AFF4567",
    "commission_percent": 20,
    "balance": 0
  }
}
```

### 2. List All Affiliates (Admin)
Fetches all affiliates and their current earnings balances.

- **URL:** `/api/affiliates`
- **Method:** `GET`

**Success Response (200 OK):**
```json
[
  {
    "_id": "65d8e...",
    "name": "Jane Streamer",
    "code": "AFF4567",
    "commission_percent": 20,
    "balance": 15.50
  }
]
```
