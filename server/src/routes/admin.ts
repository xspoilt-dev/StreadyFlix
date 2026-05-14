import { Hono } from "hono";
import { User } from "../models/User";
import { Purchase } from "../models/Purchase";
import { requireAdmin } from "../middlewares/auth";

export const adminRoutes = new Hono();

adminRoutes.use("/*", requireAdmin);

adminRoutes.get("/users", async (c) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return c.json(users);
});

adminRoutes.get("/purchases", async (c) => {
  const purchases = await Purchase.find()
    .sort({ createdAt: -1 })
    .populate("user_id", "name email")
    .populate("event_id", "name pass_name pass_price status");

  return c.json(purchases);
});
