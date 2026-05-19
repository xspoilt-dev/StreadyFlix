import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    stream_url_primary: { type: String },
    stream_url_backup: { type: String },
    pass_name: { type: String, required: true },
    pass_price: { type: Number, required: true },
    passes: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          description: { type: String },
        },
      ],
      default: [],
    },
    status: { type: String, enum: ["Draft", "Live", "Ended"], default: "Draft" },
  },
  { timestamps: true }
);

export const Event = model("Event", eventSchema);
