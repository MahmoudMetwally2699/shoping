const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  try {
    // Ensure file is a valid base64 or file path
    if (!file) throw new Error('No file provided');

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "shops", // Add a folder to organize uploads
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      timeout: 120000, // Increase timeout for large files
    });

    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
}

// Configure multer to accept only images
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  }
});

module.exports = { upload, imageUploadUtil };
