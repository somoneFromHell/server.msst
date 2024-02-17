const express = require("express");
const {
    getGallaryItems,
    addNewImageInGallary,
    getGallaryItemById,
    updateGallaryItem,
    deleteGallaeyItem,
} = require("../controllers/galleryController");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "content/gallery/");
  },
  filename: (req, file, cb) => {
    const originalFileName = file.originalname;
    const extension = originalFileName.split(".").pop();
    const newFileName = `${Date.now()}_gallary_Image.${extension}`;
    cb(null, newFileName);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

router.get("/", getGallaryItems);
router.post("/", upload.single("imagePath"), addNewImageInGallary);
router.get("/:id", getGallaryItemById);
router.put("/:id", upload.single("imagePath"), updateGallaryItem);
router.delete("/:id", deleteGallaeyItem);

module.exports = router;