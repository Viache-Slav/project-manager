import Fabric from '../models/Fabric.js';

export const getFabricMeta = async (req, res) => {
  const rows = await Fabric.aggregate([
    {
      $group: {
        _id: {
          brand: '$brand',
          collection: '$collection',
        },
        pricePerMeter: { $first: '$pricePerMeter' }
      },
    },
    {
      $group: {
        _id: '$_id.brand',
        collections: {
          $push: {
            name: '$_id.collection',
            pricePerMeter: '$pricePerMeter'
          }
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
    { $sort: { brand: 1 } },
  ]);

  res.json(rows);
};

export const getFabricColors = async (req, res) => {
  const { brand, collection } = req.query;

  if (!brand || !collection) {
    return res
      .status(400)
      .json({ message: 'brand and collection required' });
  }

  const fabrics = await Fabric.find(
    { brand, collection },
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
  const { brand, collection, pricePerMeter } = req.body;

  if (!Number.isFinite(pricePerMeter) || pricePerMeter < 0) {
    return res.status(400).json({ message: 'Invalid price' });
  }

  await Fabric.updateMany(
    { brand, collection },
    { $set: { pricePerMeter } }
  );

  res.json({ message: 'Price updated' });
};
