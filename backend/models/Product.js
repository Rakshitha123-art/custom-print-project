import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "Generic",
    },

    material: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 10,
    },

    ratings: {
      type: Number,
      default: 4,
    },

    features: {
      type: [String],
      default: [],
    },

    specifications: {
      weight: { type: String, default: "" },
      dimensions: { type: String, default: "" },
      color: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);