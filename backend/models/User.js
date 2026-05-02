import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {                 // 👈 ADD THIS
    type: Boolean,
    default: false
  },
  phone: {
  type: String,
  default: ""
},
image: {
  type: String,
  default: ""
},
addresses: [
    {
      name: String,
      phone: String,
      city: String,
      address: String,
    }
  ],
  
});

const User = mongoose.model("User", userSchema);

export default User;