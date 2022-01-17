const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Destination to store the images
const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("pets")) {
      folder = "pets";
    }

    const path = `C:/UploadsNode/${folder}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Por favor, envie apenas jpg ou png!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
