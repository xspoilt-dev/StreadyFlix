import { Hono } from "hono";
import { Affiliate } from "../models/Affiliate";
import { requireAdmin } from "../middlewares/auth";

export const affiliateRoutes = new Hono();

// Admin: Create Affiliate
affiliateRoutes.post("/", requireAdmin, async (c) => {
  const { name, commission_percent, notes } = await c.req.json();
  
  // Generate code e.g., AFF123
  const code = `AFF${Math.floor(1000 + Math.random() * 9000)}`;

  const affiliate = await Affiliate.create({
    name,
    code,
    commission_percent,
    notes
  });

  return c.json({ target_link: `/?ref=${code}`, affiliate }, 201);
});

// Admin: Get all affiliates & balances
affiliateRoutes.get("/", requireAdmin, async (c) => {
  const affiliates = await Affiliate.find().sort({ createdAt: -1 });
  return c.json(affiliates);
});
