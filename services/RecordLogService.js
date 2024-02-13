const mongoose = require('mongoose');
const Member = require('../Models/MemberModel');
const catchAsync = require('../utils/catchAsync');

exports.updateRecordLogMembers = catchAsync(async (documentId, message) => {

    console.log(documentId, message)
    const document = await Member.findById(documentId);
    document.recordLog.push({
        Date: new Date(),
        Message: message,
    });
    await document.save();
    console.log(`RecordLog updated successfully `);
})