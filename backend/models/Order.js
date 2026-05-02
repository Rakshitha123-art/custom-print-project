import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // ✅ ADD PAYMENT DETAILS HERE
    payment: {
      paymentId: String,     // razorpay_payment_id
      orderId: String,       // razorpay_order_id
      signature: String,
      method: String,
      paidAt: Date,
    },

customer: {
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: String,
  pincode: String,
},  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);