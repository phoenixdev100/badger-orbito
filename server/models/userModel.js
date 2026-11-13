import mongoose from "mongoose";

const platformSchema = {
  username:         { type: String,  default: null },
  verified:         { type: Boolean, default: false },
  verificationCode: { type: String,  default: null },
  isPublic:         { type: Boolean, default: true },   // ← NEW: visibility toggle
};

const userSchema = new mongoose.Schema({
  name:                  { type: String, required: true, trim: true },
  email:                 { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:              { type: String, required: true },
  username:              { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  usernameLastChangedAt: { type: Date, default: null },
  isProfilePublic:       { type: Boolean, default: true },
  googleId:              { type: String },
  profilePicture:        { type: String },
  bio:                   { type: String, default: '' },
  platforms: {
    credly:     platformSchema,
    leetcode:   platformSchema,
    codechef:   platformSchema,
    codestudio: platformSchema,
    codolio:    platformSchema,
  }
}, {
  timestamps: true
});

const userModel = mongoose.model('User', userSchema);
export default userModel;
