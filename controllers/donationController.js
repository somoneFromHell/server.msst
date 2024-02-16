const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Donation = require('../Models/donationModel');

exports.addDonation = catchAsync(async (req, res, next) => {
    const response = await Donation.create(req.body);
    return res.status(201).json(response);
})

exports.getAllDonations = catchAsync(async (req, res, next) => {
    const donations = await Donation.find()

    res.status(200).json(donations);
});

exports.getDonation = catchAsync(async (req, res, next) => {
    const donation = await Donation.findById(req.params.id)
    res.status(200).json(donation);
});


exports.deleteDonation = catchAsync(async (req, res, next) => {
    const donation = await Donation.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: 'success',
    });
});