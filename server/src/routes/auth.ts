import { Hono } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const authRoutes = new Hono();

// Signup
authRoutes.post("/register", async (c) => {
  const { name, email, password } = await c.req.json();
  const existingUser = await User.findOne({ email });

  if (existingUser) return c.json({ error: "Email already in use" }, 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  return c.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// Login
authRoutes.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  return c.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
