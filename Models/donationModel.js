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
        address: {
            type: String,
            required: true,
            trim: true,
        }, contact: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: Number,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Other'],
            required: true,
        },
        transactionId: {
            type: String,
            trim: true,
        },
        message: {
            type: String,
            trim: true,
        },
       
        recordLog: {
            type: Array,
            required: [{ Date: Date.now(), Message: String }],
        }
    }
    ,
    { timestamps: true }
);

const Donations = mongoose.model('Donations', DonationsSchema);

module.exports = Donations;
