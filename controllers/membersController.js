const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Member = require('../Models/MemberModel');

exports.addMember = catchAsync(async (req, res, next) => {
    const response = await Member.create(req.body);
    return res.status(201).json(response);
})

exports.getAllMembers = catchAsync(async (req, res, next) => {
    const Members = await Member.find()

    res.status(200).json(Members);
});

exports.getMember = catchAsync(async (req, res, next) => {
    const Member = await Member.findById(req.params.id)
    res.status(200).json(Member);
});


exports.deleteMember = catchAsync(async (req, res, next) => {
    const Member = await Member.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: 'success',
    });
});

exports.AcceptRequest = catchAsync(async (req, res, next) => {

    const theMember = await Member.findById(req.params.id);
    if (theMember.RequestAccepted === true) {
        await Member.findByIdAndUpdate(req.params.id, {
            
            $push: { recordLog: { Date: Date.now(), Message: "Attempt to Accept request again" } }
        }, { new: true });
        return res.status(400).json({ error: "request alrady accepted" });
    }

    const updatedMember = await Member.findByIdAndUpdate(req.params.id, {
        $set: { RequestAccepted: true },
        $push: { recordLog: { Date: Date.now(), Message: "Request Accepted" } }
    }, { new: true });

    console.log("response", updatedMember)

    if (updatedMember && updatedMember.RequestAccepted === true) {
        return  res.status(200).json(updatedMember);
    } else {
        return  res.status(400).json({ error: "Failed to update AcceptRequest status" });
    }

});