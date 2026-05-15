import { Hono } from "hono";
import Stripe from "stripe";
import { Event } from "../models/Event";
import { Purchase } from "../models/Purchase";

export const paymentRoutes = new Hono();
const stripe = new Stripe(process.env.CARD_PROCESSOR_SECRET_KEY || "", { apiVersion: "2024-04-10" as any });

const CLIENT_RETURN_URL = process.env.PUBLIC_API_URL || "http://localhost:5173";
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error("Unable to authorize PayPal");
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Unable to authorize PayPal");
  }
  return data.access_token;
};

paymentRoutes.get("/gateways", (c) => {
  const gateways = [
    { id: "card", label: "Card", enabled: Boolean(process.env.CARD_PROCESSOR_SECRET_KEY) },
    { id: "paypal", label: "PayPal", enabled: Boolean(process.env.PAYPAL_CLIENT_ID) },
  ];
  return c.json(gateways);
});

paymentRoutes.post("/card", async (c) => {
  const { event_id, user_id, affiliate_code, currency } = await c.req.json();
  const event = await Event.findById(event_id);
  if (!event) return c.json({ error: "Event not found" }, 404);

  const purchase = await Purchase.create({
    user_id,
    event_id,
    amount: event.pass_price,
    payment_method: "Card",
    affiliate_code,
    payment_status: "Pending",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency || "usd",
            product_data: {
              name: event.pass_name,
              description: event.name,
            },
            unit_amount: Math.round(event.pass_price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${CLIENT_RETURN_URL}/payments/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_RETURN_URL}/payments/cancel`,
      metadata: {
        purchase_id: purchase._id.toString(),
      },
    });

    return c.json({ url: session.url, session_id: session.id, purchase_id: purchase._id.toString() });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

paymentRoutes.post("/paypal", async (c) => {
  const { event_id, user_id, affiliate_code, currency } = await c.req.json();
  const event = await Event.findById(event_id);
  if (!event) return c.json({ error: "Event not found" }, 404);

  const purchase = await Purchase.create({
    user_id,
    event_id,
    amount: event.pass_price,
    payment_method: "PayPal",
    affiliate_code,
    payment_status: "Pending",
  });

  try {
    const accessToken = await getPayPalAccessToken();
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: (currency || "USD").toUpperCase(),
              value: event.pass_price.toFixed(2),
            },
            custom_id: purchase._id.toString(),
          },
        ],
        application_context: {
          return_url: `${CLIENT_RETURN_URL}/payments/complete?order_id={order_id}`,
          cancel_url: `${CLIENT_RETURN_URL}/payments/cancel`,
        },
      }),
    });
    if (!res.ok) {
      throw new Error("Unable to create PayPal order");
    }
    const data = (await res.json()) as {
      id?: string;
      links?: Array<{ rel: string; href: string }>;
    };
    const approvalUrl = data.links?.find((link) => link.rel === "approve")?.href;
    return c.json({ url: approvalUrl, order_id: data.id, purchase_id: purchase._id.toString() });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

paymentRoutes.post("/verify", async (c) => {
  const { provider, session_id, order_id } = await c.req.json();

  try {
    if (provider === "card" && session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const purchaseId = session.metadata?.purchase_id;
      if (session.payment_status === "paid" && purchaseId) {
        await Purchase.findByIdAndUpdate(purchaseId, {
          payment_status: "Completed",
          transaction_id: session.id,
        });
        return c.json({ success: true });
      }
      return c.json({ success: false });
    }

    if (provider === "paypal" && order_id) {
      const accessToken = await getPayPalAccessToken();
      const captureRes = await fetch(
        `${PAYPAL_API_BASE}/v2/checkout/orders/${order_id}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!captureRes.ok) {
        throw new Error("Unable to capture PayPal order");
      }
      const captureData = (await captureRes.json()) as {
        id?: string;
        purchase_units?: Array<{ custom_id?: string }>;
      };
      const purchaseId = captureData.purchase_units?.[0]?.custom_id;
      if (purchaseId) {
        await Purchase.findByIdAndUpdate(purchaseId, {
          payment_status: "Completed",
          transaction_id: captureData.id,
        });
      }
      return c.json({ success: true });
    }

    return c.json({ error: "Invalid verification payload" }, 400);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});
