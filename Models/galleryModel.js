const mongoose = require("mongoose");

const gallarySchema = new mongoose.Schema({
  imageTitle: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 400,
  },
  imagePath: {
    type: String,
    required: true,
  },
  gallaryCategoryId: {
    required: true,
    type: String,
  },
  galleryCategoryDetails: { type: Object },
  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
});

const gallaryMasterModel = mongoose.model("GallaryMaster", gallarySchema);

module.exports = gallaryMasterModel;