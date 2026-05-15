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

// Admin: Update Event (replace)
eventRoutes.put("/:id", requireAdmin, async (c) => {
  const body = await c.req.json();
  const event = await Event.findByIdAndUpdate(c.req.param("id"), body, {
    new: true,
    runValidators: true,
  });
  if (!event) return c.json({ error: "Event not found" }, 404);
  return c.json(event);
});

// Admin: Update Event (partial)
eventRoutes.patch("/:id", requireAdmin, async (c) => {
  const body = await c.req.json();
  const event = await Event.findByIdAndUpdate(c.req.param("id"), body, {
    new: true,
    runValidators: true,
  });
  if (!event) return c.json({ error: "Event not found" }, 404);
  return c.json(event);
});

// Admin: Delete Event
eventRoutes.delete("/:id", requireAdmin, async (c) => {
  const event = await Event.findByIdAndDelete(c.req.param("id"));
  if (!event) return c.json({ error: "Event not found" }, 404);
  return c.json({ success: true });
});
