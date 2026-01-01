import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Material from '../models/Material.js';

dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Material.updateMany(
      { unit: { $in: ['pcs', ''] } },
      { $set: { unit: null } }
    );

    console.log('Migration finished');
    console.log('Matched:', result.matchedCount);
    console.log('Modified:', result.modifiedCount);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
