const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Video = require('../Models/videosModel');

exports.addVideo = catchAsync(async (req, res, next) => {
    const response = await Video.create(req.body);
    return res.status(201).json(response);
});

exports.getAllVideos = catchAsync(async (req, res, next) => {
    const videos = await Video.find();
    res.status(200).json(videos);
});

exports.getVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
        return next(new AppError('Video not found', 404));
    }
    res.status(200).json(video);
});

exports.updateVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!video) {
        return next(new AppError('Video not found', 404));
    }
    res.status(200).json(video);
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
        return next(new AppError('Video not found', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
