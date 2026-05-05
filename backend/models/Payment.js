import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  orderId: String,
  paymentId: String,
  status: {
    type: String,
    default: "pending",
  },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;