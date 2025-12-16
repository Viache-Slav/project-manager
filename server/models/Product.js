import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    article: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    class: {
      type: String,
      trim: true,
    },

    image: {
      type: String, // URL
      trim: true,
    },

    materials: [
      {
        material: {
          type: Schema.Types.ObjectId,
          ref: 'Material',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    productPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('Product', productSchema);
