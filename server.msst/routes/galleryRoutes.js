const express = require("express");
const {
    getGallaryCatById,
    getGallaryCategories,
    addNewGallaryCategory,
    updateGallaryCat,
    deleteGallaeyCat,
    getAllIncDel,
} = require("../controllers/gallaryCategoryMaster");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "content/gallery/");
  },
  filename: (req, file, cb) => {
    const originalFileName = file.originalname;
    const extension = originalFileName.split(".").pop();
    const newFileName = `${Date.now()}_gallary.${extension}`;
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

router.get("/", getGallaryCategories);
router.get("/all", getAllIncDel);
router.post("/", upload.single("imagePath"), addNewGallaryCategory);
router.get("/:id", getGallaryCatById);
router.put("/:id", upload.single("imagePath"), updateGallaryCat);
router.delete("/:id", deleteGallaeyCat);

module.exports = router;