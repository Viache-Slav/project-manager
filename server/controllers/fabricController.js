import Fabric from '../models/Fabric.js';

export const getFabricMeta = async (req, res) => {
  const rows = await Fabric.aggregate([
    {
      $match: { isActive: true },
    },
    {
      $project: {
        brand: 1,
        collectionName: {
          $ifNull: ['$collectionName', '$collection'],
        },
        pricePerMeter: 1,
      },
    },
    {
      $match: {
        collectionName: { $ne: null },
      },
    },
    {
      $group: {
        _id: {
          brand: '$brand',
          collectionName: '$collectionName',
        },
        pricePerMeter: { $max: '$pricePerMeter' },
      },
    },
    {
      $group: {
        _id: '$_id.brand',
        collections: {
          $push: {
            name: '$_id.collectionName',
            pricePerMeter: '$pricePerMeter',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        brand: '$_id',
        collections: 1,
      },
    },
  ]);

  res.json(rows);
};

export const getFabricColors = async (req, res) => {
  const { brand } = req.query;
  const collectionName = req.query.collectionName || req.query.collection;

  if (!brand || !collectionName) {
    return res
      .status(400)
      .json({ message: 'brand and collection required' });
  }

  const fabrics = await Fabric.find(
    { brand, collectionName },
    {
      colorName: 1,
      colorCode: 1,
      images: 1,
      pricePerMeter: 1,
    }
  ).sort({ colorName: 1 });

  res.json(fabrics);
};

export const updateCollectionPrice = async (req, res) => {
  const { brand } = req.body;
  const collectionName = req.body.collectionName || req.body.collection;
  const pricePerMeter = Number(req.body.pricePerMeter);

  if (!brand || !collectionName) {
    return res.status(400).json({ message: 'brand and collectionName required' });
  }

  if (!Number.isFinite(pricePerMeter) || pricePerMeter < 0) {
    return res.status(400).json({ message: 'Invalid price' });
  }

  const result = await Fabric.updateMany(
    {
      brand,
      $or: [
        { collectionName },
        { collection: collectionName },
      ],
    },
    { $set: { pricePerMeter } }
  );

  res.json({
    message: 'Price updated',
    matched: result.matchedCount,
    modified: result.modifiedCount,
  });
};
