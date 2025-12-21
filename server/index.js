import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { initGridFS } from './config/gridfs.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import designItemRoutes from './routes/designItems.js';
import productTypeRoutes from './routes/productTypes.js';
import fileRoutes from './routes/files.js';

dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  'http://localhost:5173',
  'https://project-manager-rouge.vercel.app'
];

app.set('trust proxy', 1);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', trackRoutes);
app.use('/api/design-items', designItemRoutes);
app.use('/api/product-types', productTypeRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!')
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    initGridFS();

    app.listen(process.env.PORT || 5000, () => {
      console.log('✅ Server running on port', process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

