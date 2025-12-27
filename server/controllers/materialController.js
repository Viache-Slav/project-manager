import Material from '../models/Material.js';

export const getMaterials = async (req, res) => {
  const materials = await Material.find()
    .sort({ name: 1 })
    .lean();

  res.json(materials);
};

export const createMaterial = async (req, res) => {
  const { name, unit, price, categoryId } = req.body;

  if (!name || !categoryId) {
    return res
      .status(400)
      .json({ message: 'Name and category required' });
  }

  const exists = await Material.findOne({
    name: new RegExp(`^${name}$`, 'i'),
    category: categoryId,
  });

  if (exists) {
    return res
      .status(400)
      .json({ message: 'Material already exists' });
  }

  const material = await Material.create({
    name,
    unit: unit || 'pcs',
    price: price || 0,
    category: categoryId,
  });

  res.status(201).json(material);
};
