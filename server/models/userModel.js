import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  profilePicture: { type: String },
  platforms: {
    credly: { type: String, default: null },
    leetcode: { type: String, default: null },
  }
}, {
  timestamps: true  // Add timestamps for better tracking
});

const userModel = mongoose.model('User', userSchema);

export default userModel


