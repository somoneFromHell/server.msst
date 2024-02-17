const BannerMasterModel = require("../Models/bannerModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getBanner = catchAsync(async (req, res, next) => {
    const recordExists = await BannerMasterModel.find().lean();
    if (recordExists.length === 0) {
        return res.status(204).end();
    }
    return res.status(200).json(recordExists);
});


exports.addNewBanner = catchAsync(async (req, res, next) => {
    const body = {
        order: req.body.order,
        imagePath: req.file ? req.file.filename : "not given",
    };

    const newBannerAdded = await BannerMasterModel.create(body);
    res.status(201).json({
        data: newBannerAdded,
        message: "Banner added successfully",
    });

});



exports.updateBanner = catchAsync(async (req, res, next) => {
    const BannerId = req.params.id;
    const BannerToUpdate = await BannerMasterModel.findById(BannerId);

    if (!BannerToUpdate || BannerToUpdate.deleted) {
        return next(new appError(`Banner not found`, 400));
    }

    console.log(req)
    if (!req.file) {
        return next(new appError(`no image recived`, 400));
    }


    const updateData = {
    };
    if (req.file) {
        updateData.imagePath = req.file.filename;
    }
    await BannerMasterModel.findByIdAndUpdate(BannerId, updateData);
    const updatedBanner = await BannerMasterModel.findById(BannerId);
    res.status(200).json({
        message: "Banner updated successfully",
        data: updatedBanner,
    });
});

