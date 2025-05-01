import Track from '../models/Track.js';

export const createTrack = async (req, res) => {
  try {
    const { departureTime, items } = req.body;

    if (!departureTime || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const track = new Track({ departureTime, items });
    await track.save();

    res.status(201).json(track);
  } catch (err) {
    console.error('Error creating a track:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTracks = async (req, res) => {
  try {
    const tracks = await Track.find()
      .populate('items.productId', 'name')
      .sort({ departureTime: -1 });

    res.json(tracks);
  } catch (err) {
    console.error('Error fetching tracks:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
