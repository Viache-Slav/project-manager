import Product from '../models/Product.js';

export const uploadItem = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newProduct = new Product({
      title,
      description,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product uploaded successfully', product: newProduct });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    .collation({ locale: 'en', strength: 1 })
    .sort({ title: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
