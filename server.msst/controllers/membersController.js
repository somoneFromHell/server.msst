const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Member = require('../Models/MemberModel');
const nodemailer = require('nodemailer');
const { updateRecordLogMembers } = require('../services/RecordLogService');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">

<head>
  
</head>

<body style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div class="border-container" style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border: 2px solid #007bff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: left;">
    <h3>Dear Admin,</h3>
    <p style="margin-bottom: 10px;">A new member wants to join.</p>

    <img src="##image-source##" alt="Profile Image" style="max-width: 100%; height: auto; border-radius: 50%; margin: 0 auto 20px;">
    <h1 style="margin-bottom: 10px;">##name##</h1>
    <p style="margin-bottom: 10px;">contact no. : ##phone##</p>
    <p style="margin-bottom: 10px;">email : ##email##</p>
    <p style="margin-bottom: 10px;">address :##address##</p>

    <!-- Accept Button with Href -->
    <button style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 18px; margin-top: 20px;"><a href="##redirect-url##" target="_blank">Accept</a></button>
  </div>
</body>

</html>


`;

const replacePlaceholders = (template, custommerPlaceholders) => {
    let replacedTemplate = template;
    for (const placeholder in custommerPlaceholders) {
        replacedTemplate = replacedTemplate.replace(
            new RegExp(placeholder, "g"),
            custommerPlaceholders[placeholder]
        );
    }
    return replacedTemplate;
};

exports.addMember = catchAsync(async (req, res, next) => {

    const body = req.body;
    body.image = req.file.filename
console.log("email",process.env.EMAIL_USER)
console.log("pass______________",process.env.EMAIL_PASS)
    const response = await Member.create(body);
    const custommerPlaceholders = {
        "##name##": response.firstName + " " + response.lastName,
        "##email##": response.email,
        "##phone##": response.phone,
        "##address##": response.address,
        "##redirect-url##": process.env.REMOTE + "/accept-membership-request/" + response._id,
        "##image-source##": process.env.DEPLOYMENT_URL + "/" + response.image
    };

    let updatedTemplate = replacePlaceholders(
        htmlTemplate,
        custommerPlaceholders
    );

    transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: response.email,
        subject: 'New Membership Request',
        html: updatedTemplate,
    },
        (error, info) => {
            if (error) {
                updateRecordLogMembers(response._id,`Error sending email :${error}`)
               console.log("email Error")
            } else {
                
                updateRecordLogMembers(response._id,`Email sent :${info.response}`)
                console.log("email success")

            }
        })

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
        return res.status(200).json(updatedMember);
    } else {
        return res.status(400).json({ error: "Failed to update AcceptRequest status" });
    }

});