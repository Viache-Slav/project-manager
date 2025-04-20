import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  }
});

const User = mongoose.model('User', userSchema);

export default User;
