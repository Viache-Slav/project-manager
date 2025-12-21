import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const calculationSchema = new Schema(
  {
    designItem: {
      type: Schema.Types.ObjectId,
      ref: 'DesignItem',
      required: true,
      unique: true, // 1 расчет на изделие
    },

    materials: [
      {
        material: {
          type: String, // id или имя (если новый)
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          enum: ['pcs', 'm', 'm2', 'm3', 'kg'],
          required: true,
        },
      },
    ],

    designerComment: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('DesignCalculation', calculationSchema);
