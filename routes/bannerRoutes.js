const express = require("express");
const {
  getBanner,
  updateBanner,
  addNewBanner
} = require("../controllers/bannerController");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/banner");
  },
  filename: (req, file, cb) => {
    const originalFileName = file.originalname;
    const extension = originalFileName.split(".").pop();
    const newFileName = `${Date.now()}_banner.${extension}`;
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

router.get("/", getBanner);
router.put("/:id", upload.single("imagePath"), updateBanner);
router.post("/", upload.single("imagePath"), addNewBanner);

module.exports = router;