import mongoose from 'mongoose';
import { getBucket } from '../config/gridfs.js';

export const getFileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid file id' });
    }

    const bucket = getBucket();
    const _id = new mongoose.Types.ObjectId(id);

    const files = await bucket.find({ _id }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];

    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Length': file.length,
      'Cache-Control': 'public, max-age=31536000',
    });

    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Get file error:', err);
    res.status(500).json({ message: 'Failed to get file' });
  }
};
