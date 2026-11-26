import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = crypto.randomBytes(12).toString('hex');
    cb(null, `${name}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});
