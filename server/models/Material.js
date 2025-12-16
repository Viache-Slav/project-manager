import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true }, // kg, m, pcs
  price: { type: Number, required: true } // цена за единицу
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
