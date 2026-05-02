import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "guest",
  },

  name: {
    type: String,
    default: "Untitled Design",
  },

  productId: {
    type: String,
    default: "unknown",
  },

  designData: {
    type: Object,
    required: true,
  },

  // ✅ SMALL IMAGE (for grid)
  previewImage: {
    type: String,
    required: true,
  },

  // ✅ LARGE IMAGE (for full view / quality)
  previewImageLarge: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Design = mongoose.model("Design", designSchema);

export default Design;