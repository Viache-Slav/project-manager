import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'designer', 'employee', 'client'],
    default: 'employee' 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' 
  }
});

const User = mongoose.model("User", userSchema);

export default User;
