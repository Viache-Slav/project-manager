import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
  let { email, password, username, role } = req.body;

  if (!email || !password || !username || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  email = email.trim().toLowerCase();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      role,
      status: 'pending'
    });

    await newUser.save();

    res.status(200).json({ 
      message: 'Registration successful', 
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  email = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user || user.status !== 'approved') return res.status(403).json({ message: 'Access denied' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleLogin = async (req, res) => {
  const token = req.body.credential || req.body.token;
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ username: name, email, googleId: sub, role: null, status: 'pending' });
    }

    const jwtToken = jwt.sign({ id: user._id, email: user.email, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Google login successful', token: jwtToken, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(401).json({ message: 'Google token verification failed' });
  }
};
