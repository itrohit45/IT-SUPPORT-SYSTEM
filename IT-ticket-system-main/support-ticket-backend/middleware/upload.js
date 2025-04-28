const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter (only allow images or any file you want)
const fileFilter = (req, file, cb) => {
  // Accept any file for now. You can limit to images only with mimetype check
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
