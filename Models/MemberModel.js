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
       
        villageOrcity: {
            type: String,
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        RequestAccepted: {
            type: Boolean,
            default:false
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
