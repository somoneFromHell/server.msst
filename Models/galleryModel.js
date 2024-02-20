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

}, { timestamps: true });

const gallaryMasterModel = mongoose.model("GallaryMaster", gallarySchema);

module.exports = gallaryMasterModel;