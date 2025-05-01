import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  departureTime: {
    type: Date,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
}, {
  timestamps: true,
});

const Track = mongoose.model('Track', trackSchema);
export default Track;
