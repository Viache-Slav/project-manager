import DesignItem from '../models/DesignItem.js';
import ProductType from '../models/ProductType.js';
import mongoose from 'mongoose';
import { getBucket } from '../config/gridfs.js';
import Material from '../models/Material.js';

export const createDesignItem = async (req, res) => {
  try {
    const { title, type, width, height, depth, comment } = req.body;

    if (!title || !type || !width || !height) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    let productType;

    if (mongoose.Types.ObjectId.isValid(type)) {
      productType = await ProductType.findById(type);
      if (!productType) {
        return res.status(400).json({ message: 'Product type not found' });
      }
    } else {
      const name = String(type).trim();
      productType =
        (await ProductType.findOne({ name })) ||
        (await ProductType.create({ name }));
    }

    const w = Number(width);
    const h = Number(height);
    const d = depth ? Number(depth) : undefined;

    if (Number.isNaN(w) || Number.isNaN(h) || (d && Number.isNaN(d))) {
      return res.status(400).json({ message: 'Invalid dimensions' });
    }

    const bucket = getBucket();
    const imageIds = [];

    for (const file of req.files) {
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: { uploadedBy: req.user._id },
      });

      uploadStream.end(file.buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          imageIds.push(uploadStream.id);
          resolve();
        });
        uploadStream.on('error', reject);
      });
    }

    const item = await DesignItem.create({
      title,
      type: productType._id,
      images: imageIds,
      dimensions: { width: w, height: h, depth: d },
      comment,
      createdBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create design item' });
  }
};

export const getDesignItemById = async (req, res) => {
  const item = await DesignItem.findById(req.params.id)
    .populate('type')
    .populate({
      path: 'calculation.materials.material',
      populate: { path: 'category' },})
    .sort({ createdAt: -1 });

  if (!item) {
    return res.status(404).json({ message: 'Design item not found' });
  }

  const result = item.toObject();

  if (req.user.role !== 'admin') {
    delete result.salePrice;
    delete result.salePriceUpdatedAt;
  }

  res.json(result);
};

export const saveCalculation = async (req, res) => {
  try {
    const { id } = req.params;
    const { materials, fabrics, comment, mode } = req.body;

    const item = await DesignItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Design item not found' });
    }

    if (item.status === 'approved') {
      return res.status(400).json({ message: 'Editing not allowed' });
    }

    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ message: 'Materials are required' });
    }

    for (const m of materials) {
      const materialId =
        typeof m.material === 'string'
          ? m.material
          : m.material?._id;

      if (!materialId || !m.unit) continue;

      const materialDoc = await Material.findById(materialId);
      if (!materialDoc) continue;

      if (materialDoc.unit === null) {
        materialDoc.unit = m.unit;
        await materialDoc.save();
      }
    }

    item.calculation = {
      ...item.calculation,
      materials,
      comment,
      calculatedAt: new Date(),
    };

    if (mode === 'send') {
      item.status = 'to_approve';
    }

    if (Array.isArray(fabrics)) {
      const normalized = fabrics
        .filter(
          (f) =>
            f &&
            String(f.brand || '').trim() &&
            String(f.collection || '').trim() &&
            Number(f.meterage) > 0
        )
        .map((f) => ({
          brand: String(f.brand).trim(),
          collection: String(f.collection).trim(),
          meterage: Number(f.meterage),
        }));

      item.fabricSelection = {
        collections: normalized,
      };
    }

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save calculation' });
  }
};


export const getDesignItems = async (req, res) => {
  const items = await DesignItem.find()
    .populate('type')
    .sort({ createdAt: -1 });

  res.json(items);
};

export const updateDesignItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, comment, dimensions } = req.body;

    const item = await DesignItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'submitted') {
      return res.status(400).json({ message: 'Editing not allowed' });
    }

    if (title !== undefined) item.title = title;
    if (comment !== undefined) item.comment = comment;

    if (dimensions) {
      item.dimensions = { ...item.dimensions, ...dimensions };
    }

    if (type !== undefined) {
      let productType;
      if (mongoose.Types.ObjectId.isValid(type)) {
        productType = await ProductType.findById(type);
      } else {
        productType =
          (await ProductType.findOne({ name: type })) ||
          (await ProductType.create({ name: type }));
      }
      if (productType) item.type = productType._id;
    }

    if (req.files && req.files.length > 0) {
      const bucket = getBucket();

      for (const file of req.files) {
        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
          metadata: { uploadedBy: req.user._id },
        });

        uploadStream.end(file.buffer);

        await new Promise((resolve, reject) => {
          uploadStream.on('finish', () => {
            item.images.push(uploadStream.id);
            resolve();
          });
          uploadStream.on('error', reject);
        });
      }
    }

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update item' });
  }
};

export const deleteDesignItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }

    const item = await DesignItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Design item not found' });
    }

    const bucket = getBucket();

    if (Array.isArray(item.images)) {
      for (const fileId of item.images) {
        try {
          await bucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (err) {
          console.warn('Failed to delete image:', fileId);
        }
      }
    }

    await item.deleteOne();

    res.json({ message: 'Design item deleted successfully' });
  } catch (err) {
    console.error('Delete design item error:', err);
    res.status(500).json({ message: 'Failed to delete design item' });
  }
};

export const deleteDesignItemImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }

    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ message: 'Invalid image id' });
    }

    const item = await DesignItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const bucket = getBucket();

    await bucket.delete(new mongoose.Types.ObjectId(imageId));

    item.images = item.images.filter(
      (img) => img.toString() !== imageId
    );

    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete image' });
  }
};

export const returnToSubmitted = async (req, res) => {
  const item = await DesignItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (!['to_approve', 'approved'].includes(item.status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  item.status = 'submitted';
  await item.save();

  res.json(item);
};

export const getCalculation = async (req, res) => {
  const { id } = req.params;

  const item = await DesignItem.findById(id).populate({
    path: 'calculation.materials.material',
    populate: { path: 'category' },
  });

  if (!item) {
    return res.status(404).json({ message: 'Design item not found' });
  }

  const materials = item.calculation?.materials || [];
  const expenses = item.calculation?.expenses || [];

  let materialsCost = 0;
  let expensesCost = 0;
  let hasMissingPrices = false;
  let hasZeroPrices = false;

  const grouped = {};

  for (const row of materials) {
    const material = row.material;
    if (!material) continue;

    const price = material.price;
    const amount = Number(row.amount);
    const unit = row.unit || material.unit;

    let total = null;

    if (price === null || price === undefined) {
      hasMissingPrices = true;
    } else {
      if (price === 0) hasZeroPrices = true;
      total = amount * price;
      materialsCost += total;
    }

    const categoryName = material.category?.name || 'other';

    grouped[categoryName] ||= [];
    grouped[categoryName].push({
      materialId: material._id,
      name: material.name,
      unit,
      amount,
      price: price ?? null,
      total,
    });
  }

  for (const e of expenses) {
    if (typeof e.total === 'number') {
      expensesCost += e.total;
    }
  }

  const totalCost = hasMissingPrices
    ? null
    : materialsCost + expensesCost;

  res.json({
    grouped,
    summary: {
      materialsCost,
      expensesCost,
      totalCost,
      hasMissingPrices,
      hasZeroPrices,
    },
  });
};

export const approveCalculation = async (req, res) => {
  const item = await DesignItem.findById(req.params.id).populate({
    path: 'calculation.materials.material',
  });

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (item.status !== 'to_approve') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const materials = item.calculation?.materials || [];
  const expenses = item.calculation?.expenses || [];

  let hasMissingPrices = false;
  let hasZeroPrices = false;

  let materialsCost = 0;
  let expensesCost = 0;

  for (const m of materials) {
    const price = m.material?.price;

    if (price === null || price === undefined) hasMissingPrices = true;
    if (price === 0) hasZeroPrices = true;

    const amount = Number(m.amount || 0);
    const p = Number(price || 0);

    materialsCost += amount * p;
  }

  for (const e of expenses) {
    if (typeof e.total === 'number') {
      expensesCost += e.total;
    } else {
      const amount = Number(e.amount || 1);
      const price = Number(e.price || 0);
      expensesCost += amount * price;
    }
  }

  if (hasMissingPrices || hasZeroPrices) {
    return res.status(400).json({
      message: 'Cannot approve: invalid prices',
      hasMissingPrices,
      hasZeroPrices,
    });
  }

  if (!item.comment || !item.comment.trim()) {
    return res.status(400).json({
      message: 'Description is required before approval',
    });
  }

  const totalCost = materialsCost + expensesCost;
  const salePrice = Number((totalCost * 2).toFixed(2));

  item.status = 'approved';
  item.salePrice = salePrice;
  item.approvedAt = new Date();
  item.salePriceUpdatedAt = new Date();

  await item.save();

  res.json(item);
};

export const updateExpenses = async (req, res) => {
  const { id } = req.params;
  const expenses = req.body;

  if (!Array.isArray(expenses)) {
    return res.status(400).json({ message: 'Invalid expenses data' });
  }

  const item = await DesignItem.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  item.calculation ||= {};

  item.calculation.expenses = expenses.map((e) => ({
    type: e.type,
    title: e.title,
    amount: Number(e.amount || 1),
    unit: e.unit || null,
    price: Number(e.price || 0),
    total: Number(e.amount || 1) * Number(e.price || 0),
  }));

  item.calculation.calculatedAt = new Date();

  await item.save();

  res.json(item.calculation.expenses);
};

export const updateSalePrice = async (req, res) => {
  const { id } = req.params;
  const { salePrice } = req.body;

  const num = Number(salePrice);

  if (!Number.isFinite(num) || num <= 0) {
    return res.status(400).json({ message: 'Invalid sale price' });
  }

  const item = await DesignItem.findById(id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (item.status !== 'approved') {
    return res.status(400).json({ message: 'Item not approved' });
  }

  item.salePrice = Number(num.toFixed(2));
  item.salePriceUpdatedAt = new Date();

  await item.save();

  res.json(item);
};

export const getPublicDesignItems = async (req, res) => {
  try {
    const items = await DesignItem.find({ status: 'approved' })
      .populate('type')
      .select({
        title: 1,
        type: 1,
        images: 1,
        dimensions: 1,
        salePrice: 1,
        comment: 1,
        fabricSelection: 1,
      })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load public design items' });
  }
};
