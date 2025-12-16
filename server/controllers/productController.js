import Product from '../models/Product.js';
import Material from '../models/Material.js';

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      article,
      class: productClass,
      image,
      productPrice,
      materials = [],
    } = req.body;

    if (!title || !article || productPrice === undefined) {
      return res.status(400).json({
        message: 'title, article and productPrice are required',
      });
    }

    const exists = await Product.findOne({ article });
    if (exists) {
      return res.status(400).json({
        message: 'Product with this article already exists',
      });
    }

    for (const item of materials) {
      if (!item.material || !item.quantity) {
        return res.status(400).json({
          message: 'Each material must have material and quantity',
        });
      }

      const materialExists = await Material.findById(item.material);
      if (!materialExists) {
        return res.status(400).json({
          message: `Material not found: ${item.material}`,
        });
      }
    }

    const product = await Product.create({
      title,
      description,
      article,
      class: productClass,
      image,
      productPrice,
      materials,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const getProducts = async (req, res) => {
  const products = await Product.find()
    .populate('materials.material')
    .sort({ createdAt: -1 });

  const result = products.map((p) => {
    const costPrice = p.materials.reduce((sum, item) => {
      return sum + item.material.price * item.quantity;
    }, 0);

    return {
      ...p.toObject(),
      costPrice,
      margin: p.productPrice - costPrice,
    };
  });

  res.json(result);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const updated = await Product.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};
