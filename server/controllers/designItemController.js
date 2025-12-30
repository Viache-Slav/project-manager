import DesignItem from '../models/DesignItem.js';
import ProductType from '../models/ProductType.js';
import mongoose from 'mongoose';
import { getBucket } from '../config/gridfs.js';

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

  res.json(item);
};

export const saveCalculation = async (req, res) => {
  try {
    const { id } = req.params;
    const { materials, comment, mode } = req.body;

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

    item.calculation = {
      materials,
      comment,
      calculatedAt: new Date(),
    };

    if (mode === 'send') {
      item.status = 'to_approve';
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

export const approveCalculation = async (req, res) => {
  const item = await DesignItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (item.status !== 'to_approve') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  item.status = 'approved';
  await item.save();

  res.json(item);
};

export const returnToSubmitted = async (req, res) => {
  const item = await DesignItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (item.status !== 'to_approve') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  item.status = 'submitted';
  await item.save();

  res.json(item);
};

