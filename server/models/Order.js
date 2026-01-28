import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderItemSchema = new Schema(
  {
    designItem: {
      type: Schema.Types.ObjectId,
      ref: 'DesignItem',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    productImage: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },

    basePrice: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    fabric: {
      brand: String,
      collection: String,
      color: String,
      code: String,
      image: {
        type: Schema.Types.ObjectId,
        ref: 'File',
      },
    },

    finalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new Schema(
  {
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    customer: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['new', 'confirmed', 'in_work', 'completed', 'cancelled'],
      default: 'new',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('Order', orderSchema);
