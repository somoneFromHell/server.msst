const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  
  imagePath: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
  },
  
},
{ timestamps: true });

const BannerMasterModel = mongoose.model("banner_master", bannerSchema);

module.exports = BannerMasterModel;