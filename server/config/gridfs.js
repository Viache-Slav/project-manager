import mongoose from 'mongoose';

let bucket = null;

export const initGridFS = () => {
  const db = mongoose.connection.db;

  // ВАЖНО: используем GridFSBucket из mongoose
  const { GridFSBucket } = mongoose.mongo;

  bucket = new GridFSBucket(db, {
    bucketName: 'uploads',
  });
};

export const getBucket = () => {
  if (!bucket) {
    throw new Error('GridFSBucket not initialized');
  }
  return bucket;
};
