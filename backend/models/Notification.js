import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    productId: String,

    isRead: { type: Boolean, default: false }, // ✅ MUST MATCH FRONTEND
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);