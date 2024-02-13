const gallaryMasterModel = require("../models/galleryMasterModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getGallaryItems = catchAsync(async (req, res, next) => {
  const recordExists = await gallaryMasterModel.find({ deleted: false });
  if (recordExists.length === 0) {
    return res.status(204).end();
  }
  return res.status(200).json({ data: recordExists });
});

exports.addNewImageInGallary = catchAsync(async (req, res, next) => {
  const body = {
    imageTitle: req.body.imageTitle,
    description: req.body.description,
    gallaryCategoryId:req.body.gallaryCategoryId,
    imagePath: req.file ? req.file.filename : "",
  };
  const ItemIsUnique =
    (await gallaryMasterModel.find({
        imageTitle: req.body.imageTitle,
      deleted: false,
    }).count()) === 0;
  if (ItemIsUnique) {
    const newRecordAdded = await gallaryMasterModel.create(body);
    res.status(201).json({
      data: newRecordAdded,
      message: "image added in gallary added successfully",
    });
  } else {
    return next(
      new appError(`record with name '${body.imageTitle}' alrady exist`, 400)
    );
  }
});

exports.getGallaryItemById = catchAsync(async (req, res, next) => {
  const recordExists = await gallaryMasterModel.findById(req.params.id);
  if (!recordExists || recordExists.deleted) {
    return next(new appError(`Gallary item not found`, 400));
  } else {
    res.status(200).send({ data: recordExists });
  }
});

exports.updateGallaryItem = catchAsync(async (req, res, next) => {
  const GallaryId = req.params.id;
  const RecordToUpdate = await gallaryMasterModel.findById(GallaryId);

  if (!RecordToUpdate || RecordToUpdate.deleted) {
    return next(new appError(`Gallary item not found`, 400));
  }
  const updateData = {
    imageTitle: req.body.imageTitle,
    description: req.body.description,
    gallaryCategoryId:req.body.gallaryCategoryId,
    active:req.body.active,
    updatedAt: Date.now(),
  };

  if (req.file) {
    updateData.imagePath = req.file.filename;
  }
  await gallaryMasterModel.findByIdAndUpdate(GallaryId, updateData);
  const updatedRecord = await gallaryMasterModel.findById(GallaryId);
  res.status(200).json({
    message: "Record updated successfully",
    data: updatedRecord,
  });
});

exports.deleteGallaeyItem = catchAsync(async (req, res, next) => {
  const record = await gallaryMasterModel.findByIdAndUpdate(
    req.params.id,
    {
      deleted: true,
      deletedAt: new Date(),
    },
    { new: true }
  );

  if (!record) {
    return res.status(404).json({ message: "record not found" });
  }

  return res.status(204).end();
});

