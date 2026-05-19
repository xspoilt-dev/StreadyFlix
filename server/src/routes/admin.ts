import { Hono } from "hono";
import { User } from "../models/User";
import { Purchase } from "../models/Purchase";
import { Affiliate } from "../models/Affiliate";
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

adminRoutes.post("/purchases/:id/refund", async (c) => {
  const purchase = await Purchase.findById(c.req.param("id"));
  if (!purchase) return c.json({ error: "Purchase not found" }, 404);

  if (purchase.payment_status === "Refunded") {
    return c.json(purchase);
  }

  if (purchase.affiliate_code) {
    const affiliate = await Affiliate.findOne({ code: purchase.affiliate_code });
    if (affiliate) {
      const commission = (purchase.amount * affiliate.commission_percent) / 100;
      affiliate.balance = Math.max(0, affiliate.balance - commission);
      await affiliate.save();
    }
  }

  purchase.payment_status = "Refunded";
  await purchase.save();
  return c.json(purchase);
});
