import { Hono } from "hono";
import { cors } from "hono/cors";
import { connectDB } from "./config/db";
import { authRoutes } from "./routes/auth";
import { eventRoutes } from "./routes/events";
import { paymentRoutes } from "./routes/payments";
import { affiliateRoutes } from "./routes/affiliates";
import { adminRoutes } from "./routes/admin";

// Setup Envs
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // Assuming .env is at the root

const app = new Hono();

// Middleware
app.use("/*", cors());

// Routes
app.route("/api/auth", authRoutes);
app.route("/api/events", eventRoutes);
app.route("/api/payments", paymentRoutes);
app.route("/api/affiliates", affiliateRoutes);
app.route("/api/admin", adminRoutes);

app.get("/", (c) => c.text("StreadyFlix API is running!"));

// Connect DB and Start (Bun handles starting implicitly if we export default)
connectDB();

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
