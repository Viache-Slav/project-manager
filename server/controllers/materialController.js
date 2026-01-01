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
    unit: null,
    price: price ?? 0,
    category: categoryId,
  });

  res.status(201).json(material);
};

export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, price, quantity, category } = req.body;

    const material = await Material.findById(id);
    if (!material) {
      return res
        .status(404)
        .json({ message: 'Material not found' });
    }

    if (name !== undefined) material.name = name;
    if (unit !== undefined) material.unit = unit;
    if (price !== undefined) material.price = price;
    if (quantity !== undefined) material.quantity = quantity;
    if (category !== undefined) material.category = category;

    await material.save();

    res.json(material);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Failed to update material' });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);
    if (!material) {
      return res
        .status(404)
        .json({ message: 'Material not found' });
    }

    await material.deleteOne();

    res.json({ message: 'Material deleted' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Failed to delete material' });
  }
};
