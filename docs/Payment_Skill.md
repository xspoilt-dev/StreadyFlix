# 💳 Payment Integration Skill: Stripe & PayPal

This guide documents the implementation of a robust, multi-gateway payment system using **Stripe** and **PayPal** (along with NBC and Payblis) in a **Next.js (Client)** and **Hono/Bun (Server)** architecture.

---

## 🛠️ Technology Stack & Versions

### Client-Side (Next.js)
| Library | Version | Purpose |
| :--- | :--- | :--- |
| `@stripe/stripe-js` | `^4.10.0` | Stripe Core SDK |
| `@stripe/react-stripe-js` | `^2.9.0` | React components for Stripe Elements |
| `react-icons`, `react-icons/si` | `^5.x.x` | Payment provider icons |

### Server-Side (Hono/Bun)
| Library | Purpose |
| :--- | :--- |
| `hono` | Lightweight web framework |
| `mongoose` | MongoDB Object Modeling |
| `Native fetch` | Used for all API communications (Zero-dependency SDK approach) |

---

## 🔄 Payment Lifecycle Flow

The system follows a "Deferred Verification" pattern to ensure reliability and security.

### 1. Initiation (Frontend)
- **Gateways Discovery**: Client fetches active gateways from `GET /api/v1/payments/gateways`.
- **Payment Request**: Client sends `POST /api/v1/payments/{provider}` with `event_id`, `pass_id`, and `currency`.

### 2. Provider Handshake (Backend)
- **DB Record**: A `Payment` record is created in MongoDB with status `PENDING`.
- **Stripe**: Backend calls Stripe API via raw `fetch` to create a `PaymentIntent` and returns the `client_secret`.
- **PayPal**: Backend gets an OAuth token, creates a PayPal order, and returns an `approval_url`.

### 3. Execution (Frontend)
- **Stripe**: The client uses `Elements` and `PaymentElement` from `@stripe/react-stripe-js` to render a secure checkout form.
- **PayPal**: The client performs a full-page redirect to the `approval_url`.

### 4. Completion & Verification
- **Redirect**: User is redirected back to `/payments/complete?payment_id=...`.
- **Client Polling**: The frontend calls `POST /api/v1/payments/verify` with the `payment_id`.
- **Server Verification**:
    - **Stripe**: Backend retrieves the `PaymentIntent` status. If `succeeded`, updates DB to `COMPLETED`.
    - **PayPal**: Backend calls the PayPal Capture API. If successful, updates DB to `COMPLETED`.
- **Post-Payment Logic**: Once verified, the server triggers:
    1. Event registration update.
    2. Affiliate commission calculation.
    3. Email confirmation (via background worker).

---

## 🔒 CORS & Security Handling

CORS is managed via a dedicated middleware to allow communication between the Client (Next.js) and API (Hono).

### Implementation (`server/src/middleware/cors.ts`)
```typescript
import { cors } from "hono/cors";

export const corsMiddleware = () => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];

    return cors({
        origin: (origin) => {
            if (process.env.ALLOWED_ORIGINS === "*") return origin;
            if (allowedOrigins.includes(origin)) return origin;
            return allowedOrigins[0]; // Fallback to first allowed origin
        },
        allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
        credentials: true,
    });
};
```

---

## 📦 Backend Implementation Snippets (Zero-SDK Approach)

### Stripe Payment Intent Creation
Using raw `fetch` avoids heavy SDK dependencies and keeps the Bun environment lean.

```typescript
async function createStripePaymentIntent(secretKey: string, amount: number, currency: string) {
    const params = new URLSearchParams({
        amount: Math.round(amount * 100).toString(), // Convert to cents
        currency,
        "automatic_payment_methods[enabled]": "true",
    });

    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });
    return await res.json();
}
```

### PayPal Order Capture
```typescript
async function capturePayPalOrder(accessToken: string, orderID: string) {
    const res = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: "{}",
    });
    return await res.json();
}
```

---

## 📋 Integration Checklist for New Websites

1.  **Environment Variables**:
    - `STRIPE_SECRET_KEY` & `STRIPE_PUBLIC_KEY`
    - `PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET`
    - `ALLOWED_ORIGINS` (CSV of frontend URLs)
2.  **Database**: Ensure `Payment` and `PaymentGateway` schemas are migrated.
3.  **Frontend Components**:
    - Copy `PaymentModal.jsx` and `StripeCheckout.jsx`.
    - Ensure `process.env.NEXT_PUBLIC_API_URL` is set.
4.  **Verification**: Always use the `/verify` endpoint on the return page to ensure the backend confirms the payment with the provider before granting access.

---
