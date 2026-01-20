import mongoose from 'mongoose';

const fabricSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    collectionName: {
      type: String,
      required: true,
      trim: true,
    },

    colorName: {
      type: String,
      trim: true,
    },

    colorCode: {
      type: String,
      trim: true,
    },

    composition: {
      type: String,
    },

    abrasion: {
      type: Number,
    },

    width: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    pricePerMeter: {
      type: Number,
      required: true,
      default: 0,
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fs.files',
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

fabricSchema.index(
  { brand: 1, collectionName: 1, colorCode: 1 },
  { unique: true }
);

export default mongoose.model('Fabric', fabricSchema);
