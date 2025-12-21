import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
