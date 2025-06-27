const multer = require('multer');
const path = require('path');

// Define the storage destination and filename format for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../assets/images'));
  },
  filename: function (req, file, cb) {
    // Use the original name of the file, but with a unique timestamp added
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1675720337455.jpg
  },
});

const materialStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../assets/materials'));
  },
  filename: function (req, file, cb) {
    // Use the original name of the file, but with a unique timestamp added
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1675720337455.jpg
  },
});


const upload = multer({ storage: storage });
const materialUpload = multer({ storage: materialStorage });

module.exports = { upload, materialUpload };
