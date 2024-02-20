const catchAsync = require("../utils/catchAsync");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
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


exports.sendEmailForNewMember = catchAsync(async (req, res, next) => {


    let updatedTemplate = replacePlaceholders(
        htmlTemplate,
        custommerPlaceholders
    );

    transporter.sendMail({
        from: process.env.EMAIL_USER || "akash@barodaweb.net",
        to: response.email,
        subject: 'New Membership Request',
        html: updatedTemplate
    })
})