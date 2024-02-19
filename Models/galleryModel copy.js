const mongoose = require("mongoose");

const gallarySchema = new mongoose.Schema({

  imagePath: {
    type: String,
    required: true,
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