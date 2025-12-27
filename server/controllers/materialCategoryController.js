import MaterialCategory from '../models/MaterialCategory.js';
import Material from '../models/Material.js';

export const getMaterialCategories = async (req, res) => {
  const categories = await MaterialCategory.find().lean();
  const materials = await Material.find().lean();

  const map = {};

  categories.forEach((c) => {
    map[c._id] = { ...c, materials: [] };
  });

  materials.forEach((m) => {
    if (map[m.category]) {
      map[m.category].materials.push(m);
    }
  });

  res.json(Object.values(map));
};

export const createMaterialCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name required' });
  }

  const exists = await MaterialCategory.findOne({
    name: new RegExp(`^${name}$`, 'i'),
  });

  if (exists) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  const category = await MaterialCategory.create({ name });
  res.status(201).json(category);
};