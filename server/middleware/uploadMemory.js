import multer from 'multer';

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 10,
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(
      file.mimetype
    );
    if (!ok) return cb(new Error('Only images are allowed'));
    cb(null, true);
  },
});
