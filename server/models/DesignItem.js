import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const designItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: Schema.Types.ObjectId,
      ref: 'ProductType',
      required: true,
    },

    images: {
      type: [Schema.Types.ObjectId],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one image is required',
      },
    },

    dimensions: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
      },
    },

    comment: {
      type: String,
      trim: true,
    },

    calculation: {
      materials: [
        {
          material: {
            type: Schema.Types.ObjectId,
            ref: 'Material',
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          unit: {
            type: String,
            required: true,
          },
        },
      ],

      expenses: [
        {
          type: {
            type: String,
            enum: ['labor', 'service', 'other'],
            required: true,
          },

          title: {
            type: String,
            required: true,
            trim: true,
          },

          amount: {
            type: Number,
            default: 1,
          },

          unit: {
            type: String,
            default: null,
          },

          price: {
            type: Number,
            required: true,
          },

          total: {
            type: Number,
            required: true,
          },
        },
      ],
      
      comment: {
        type: String,
        trim: true,
      },
      calculatedAt: {
        type: Date,
      },
    },

    status: {
      type: String,
      enum: ['submitted', 'to_approve', 'approved'],
      default: 'submitted',
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

export default model('DesignItem', designItemSchema);
