import Material from '../models/Material.js';

export const getMaterials = async (req, res) => {
  const materials = await Material.find().sort({ name: 1 });
  res.json(materials);
};
