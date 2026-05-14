import { Hono } from "hono";
import Stripe from "stripe";
import { Event } from "../models/Event";
import { Purchase } from "../models/Purchase";

export const paymentRoutes = new Hono();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-04-10" as any });

// Create a checkout session (Stripe)
paymentRoutes.post("/create-checkout-session", async (c) => {
  const { event_id, user_id, affiliate_code } = await c.req.json();
  
  const event = await Event.findById(event_id);
  if (!event) return c.json({ error: "Event not found" }, 404);

  // Create pending purchase
  const purchase = await Purchase.create({
    user_id,
    event_id,
    amount: event.pass_price,
    payment_method: "Stripe",
    affiliate_code,
    payment_status: "Pending"
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
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
      success_url: `${process.env.PUBLIC_API_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_API_URL || "http://localhost:3000"}/cancel`,
      metadata: {
        purchase_id: purchase._id.toString(),
      }
    });

    return c.json({ id: session.id, url: session.url });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});
