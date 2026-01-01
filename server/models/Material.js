import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      required: false,
      default: null,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    quantity: {
      type: Number,
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaterialCategory',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Material', materialSchema);
