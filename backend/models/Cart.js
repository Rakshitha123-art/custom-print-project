import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    name: String,
    image: String,
    price: Number,

    quantity: {
      type: Number,
      default: 1,
    },

    isCustom: {
      type: Boolean,
      default: false,
    },
  },
]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);