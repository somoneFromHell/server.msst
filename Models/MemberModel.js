const mongoose = require('mongoose');
const validator = require('validator');

const MemberSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please provide your first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please provide your last name'],
            trim: true,
        },
        image: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Please provide your date of birth'],
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            validate: [validator.isEmail, 'Please enter a valid email'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number'],
            trim: true,
        },
        altPhone: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        RequestAccepted: {
            type: Boolean,
            default:false
        },
        zipCode:{
            type: String,
            required: [true, 'Please provide your zip code'],
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Please provide your address'],
            trim: true,
        },
        recordLog:{
            type: Array,
            required: [{Date:Date.now(),Message:String}],
        }
    },
    { timestamps: true }
);

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
