import DesignItem from '../models/DesignItem.js';
import ProductType from '../models/ProductType.js';
import mongoose from 'mongoose';
import { getBucket } from '../config/gridfs.js';
import DesignCalculation from '../models/DesignCalculation.js';

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

      if (!name) {
        return res.status(400).json({ message: 'Type is required' });
      }

      productType = await ProductType.findOne({ name });

      if (!productType) {
        productType = await ProductType.create({ name });
      }
    }

    const w = Number(width);
    const h = Number(height);
    const d =
      depth !== undefined && depth !== '' ? Number(depth) : undefined;

    if (Number.isNaN(w) || Number.isNaN(h)) {
      return res.status(400).json({ message: 'Invalid dimensions' });
    }

    if (d !== undefined && Number.isNaN(d)) {
      return res.status(400).json({ message: 'Invalid depth' });
    }

    const bucket = getBucket();
    const imageIds = [];

    for (const file of req.files) {
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: {
          uploadedBy: req.user._id,
        },
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
      dimensions: {
        width: w,
        height: h,
        depth: d,
      },
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
  const { id } = req.params;

  const item = await DesignItem.findById(id)
    .populate('type')
    .populate('calculation');

  if (!item) {
    return res.status(404).json({ message: 'Design item not found' });
  }

  res.json(item);
};

export const saveCalculation = async (req, res) => {
  try {
    const { id } = req.params;
    const { materials, designerComment, mode } = req.body;

    const item = await DesignItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Design item not found' });
    }

    if (item.status !== 'submitted') {
      return res
        .status(400)
        .json({ message: 'Editing is not allowed for this status' });
    }

    if (!Array.isArray(materials) || materials.length === 0) {
      return res
        .status(400)
        .json({ message: 'Materials are required' });
    }

    let calculation = await DesignCalculation.findOne({
      designItem: id,
    });

    if (!calculation) {
      calculation = await DesignCalculation.create({
        designItem: id,
        materials,
        designerComment,
        createdBy: req.user._id,
      });
    } else {
      calculation.materials = materials;
      calculation.designerComment = designerComment;
      await calculation.save();
    }

    item.calculation = calculation._id;

    if (mode === 'send') {
      item.status = 'to_approve';
    }

    await item.save();

    res.json({ success: true });
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
    const {
      title,
      type,
      comment,
      dimensions,
    } = req.body;

    const item = await DesignItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'submitted') {
      return res
        .status(400)
        .json({ message: 'Editing is not allowed for this status' });
    }

    if (title !== undefined) item.title = title;
    if (comment !== undefined) item.comment = comment;

    if (dimensions) {
      item.dimensions = {
        ...item.dimensions,
        ...dimensions,
      };
    }

    if (type !== undefined) {
      let productType;

      if (mongoose.Types.ObjectId.isValid(type)) {
        productType = await ProductType.findById(type);
      } else {
        productType = await ProductType.findOne({ name: type });
        if (!productType) {
          productType = await ProductType.create({ name: type });
        }
      }

      if (productType) {
        item.type = productType._id;
      }
    }

    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update item' });
  }
};
