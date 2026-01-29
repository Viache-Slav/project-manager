import Order from '../models/Order.js';
import DesignItem from '../models/DesignItem.js';

export const createOrder = async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    if (
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.phone
    ) {
      return res.status(400).json({
        message: 'Customer name, email and phone are required',
      });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const row of items) {
      const { designItemId, quantity, options, productImageId } = row;

      if (!designItemId || !quantity || quantity <= 0) {
        return res.status(400).json({
          message: 'Invalid order item data',
        });
      }

      const item = await DesignItem.findById(designItemId);

      if (!item) {
        return res.status(404).json({
          message: 'Design item not found',
        });
      }

      if (item.status !== 'approved') {
        return res.status(400).json({
          message: `Item "${item.title}" is not available for order`,
        });
      }

      const basePrice = Number(item.salePrice);
      const qty = Number(quantity);

      const finalPrice = Number((basePrice * qty).toFixed(2));
      totalPrice += finalPrice;

      orderItems.push({
        designItem: item._id,
        title: item.title,
        productImage: productImageId || item.images?.[0] || null,
        basePrice,
        quantity: qty,
        fabric: options?.fabric
          ? {
              brand: options.fabric.brand,
              collection: options.fabric.collectionName,
              color: options.fabric.color,
              code: options.fabric.code || null,
              image: options.fabric.imageId || null,
            }
          : null,
        finalPrice,
      });
    }

    const order = await Order.create({
      items: orderItems,
      customer: {
        user: req.user._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      totalPrice: Number(totalPrice.toFixed(2)),
      status: 'new',
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'customer.user': req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch my orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      'new',
      'confirmed',
      'in_work',
      'completed',
      'cancelled',
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};
