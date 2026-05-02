import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  theme: {
    type: String,
    default: "light",
  },
  notifications: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("UserSettings", userSettingsSchema);