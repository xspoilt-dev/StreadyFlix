import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import { User } from "./models/User";
import { Event } from "./models/Event";
import { Affiliate } from "./models/Affiliate";
import { Purchase } from "./models/Purchase";

dotenv.config({ path: "../.env" });

const seed = async () => {
  await connectDB();

  if (process.env.SEED_RESET === "true") {
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Affiliate.deleteMany({}),
      Purchase.deleteMany({}),
    ]);
  }

  const existingAdmin = await User.findOne({ email: "admin@streadyflix.com" });
  let adminUser = existingAdmin;

  if (!adminUser) {
    const adminPassword = await bcrypt.hash("admin123", 10);
    adminUser = await User.create({
      name: "Admin",
      email: "admin@streadyflix.com",
      password: adminPassword,
      role: "admin",
    });
  }

  const existingUser = await User.findOne({ email: "fan@streadyflix.com" });
  let normalUser = existingUser;

  if (!normalUser) {
    const userPassword = await bcrypt.hash("fan123", 10);
    normalUser = await User.create({
      name: "Jordan Fan",
      email: "fan@streadyflix.com",
      password: userPassword,
      role: "user",
    });
  }

  const existingEvent = await Event.findOne({ name: "Championship Night" });
  let liveEvent = existingEvent;

  if (!liveEvent) {
    liveEvent = await Event.create({
      name: "Championship Night",
      description: "Title fight featuring the season's top contenders in a five-round showdown.",
      thumbnail: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1600&q=80",
      start_date: new Date(Date.now() + 1000 * 60 * 60 * 2),
      end_date: new Date(Date.now() + 1000 * 60 * 60 * 4),
      stream_url_primary: "https://www.w3schools.com/html/mov_bbb.mp4",
      stream_url_backup: "https://www.w3schools.com/html/movie.mp4",
      pass_name: "Championship Pass",
      pass_price: 24.99,
      status: "Live",
    });
  }

  const existingAffiliate = await Affiliate.findOne({ code: "AFF2024" });
  let affiliate = existingAffiliate;

  if (!affiliate) {
    affiliate = await Affiliate.create({
      name: "Arena Insider",
      code: "AFF2024",
      commission_percent: 15,
      notes: "Main partner broadcast link",
      balance: 0,
    });
  }

  const existingPurchase = await Purchase.findOne({
    user_id: normalUser?._id,
    event_id: liveEvent?._id,
  });

  if (!existingPurchase && normalUser && liveEvent) {
    await Purchase.create({
      user_id: normalUser._id,
      event_id: liveEvent._id,
      amount: liveEvent.pass_price,
      payment_method: "Card",
      payment_status: "Completed",
      affiliate_code: affiliate?.code,
      transaction_id: "seed_txn_001",
    });
  }

  console.log("Seed completed.");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
