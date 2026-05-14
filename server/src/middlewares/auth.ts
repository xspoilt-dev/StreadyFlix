import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

type JwtPayload = {
  id: string;
  role: string;
};

const getToken = (c: Context) => {
  const header = c.req.header("authorization") || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return null;
};

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
};

export const requireAuth = async (c: Context, next: Next) => {
  const token = getToken(c);
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const payload = verifyToken(token);
    c.set("user", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
};

export const requireAdmin = async (c: Context, next: Next) => {
  const token = getToken(c);
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const payload = verifyToken(token);
    if (payload.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }
    c.set("user", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
};
