const mongoose = require('mongoose');
const validator = require('validator');

const DonationsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, ' Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            validate: [validator.isEmail, 'Please enter a valid Email'],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        altPhone: {
            type: Number,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        donationId: {
            type: String,
            default: `SMSST${Date.now()}`
        }
        ,
        donationRecipt: {
            type: String,
        },
        paymentMethod: {
            type: String,
        },
        transactionId: {
            type: String,
            trim: true,
        },
        message: {
            type: String,
            trim: true,
        },
        IspaymentSuccess: {
            type: Boolean,
            dafault: false
        },
        recordLog: {
            type: Array,
            required: [{ Date: Date.now(), Message: String }],
        },
        donationReciptHTML: {
            type: String
        }
    }
    ,
    { timestamps: true }
);

const Donations = mongoose.model('Donations', DonationsSchema);

module.exports = Donations;
