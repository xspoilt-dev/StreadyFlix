import { Hono } from "hono";
import { Event } from "../models/Event";
import { requireAdmin } from "../middlewares/auth";

export const eventRoutes = new Hono();

// List all events
eventRoutes.get("/", async (c) => {
  const events = await Event.find().sort({ start_date: -1 });
  return c.json(events);
});

// Admin: Create Event (Simplified, no auth guard yet)
eventRoutes.post("/", requireAdmin, async (c) => {
  const body = await c.req.json();
  const event = await Event.create(body);
  return c.json(event, 201);
});

// Get Event by ID
eventRoutes.get("/:id", async (c) => {
  const event = await Event.findById(c.req.param("id"));
  if (!event) return c.json({ error: "Event not found" }, 404);
  return c.json(event);
});
