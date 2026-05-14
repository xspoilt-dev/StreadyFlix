import { Schema, model } from "mongoose";

const affiliateSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    commission_percent: { type: Number, required: true, min: 0, max: 100 },
    notes: { type: String },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Affiliate = model("Affiliate", affiliateSchema);
