import express from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import './config/passport.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import trackRoutes from './routes/trackRoutes.js';

dotenv.config()
const app = express()

app.set('trust proxy', 1)

app.use(session({
  secret: 'some secret key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,     
    sameSite: 'none'   
  }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true 
}));
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', uploadRoutes);
app.use('/api/routes', trackRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!')
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log('✅ Server running on port', process.env.PORT)
    )
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err))
