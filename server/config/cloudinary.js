const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Resume Storage ─────────────────────────────────────────────────────────────
// Always overrides the same public_id so there's only ever one resume file.
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'neeraj_portfolio/resume',
    public_id: () => 'resume',   // fixed name → always replaces the same file
    resource_type: 'raw',        // needed for PDFs
    format: 'pdf',
    overwrite: true,
    invalidate: true,
  },
});

const resumeUpload = multer({
  storage: resumeStorage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ── Certificate Storage ────────────────────────────────────────────────────────
// Uses a timestamped public_id so each certificate is unique.
const certificateStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';
    return {
      folder: 'neeraj_portfolio/certificates',
      public_id: `cert_${Date.now()}`,
      resource_type: isPdf ? 'raw' : 'image',
      overwrite: false,
    };
  },
});

const certificateUpload = multer({
  storage: certificateStorage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF or image files are allowed for certificates.'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { cloudinary, resumeUpload, certificateUpload };
