import { Schema, model } from "mongoose";

const purchaseSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event_id: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, enum: ["Card", "PayPal"], required: true },
    payment_status: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded"], default: "Pending" },
    affiliate_code: { type: String },
    transaction_id: { type: String },
  },
  { timestamps: true }
);

export const Purchase = model("Purchase", purchaseSchema);
