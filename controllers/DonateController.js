const crypto = require('crypto');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const Donations = require('../Models/donationModel');
const { convertAndSavePDF } = require('../services/convertAndSavePDF');


const reciptTemplate = `<table border="0" cellpadding="0" cellspacing="0" width="100%">

<tbody>
    <tr>
        <td bgcolor="#ff7d25" align="center" style="padding:0px 10px 0px 10px">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                <tbody>
                    <tr>
                        <td align="center" style="padding:20px">
                            <img src="http://45.79.126.76:8000/static/media/mahakalsena.9c900591dfb4d5cc79e5.png"
                                alt="Your logo here" style="width:150px">
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top"
                            style="padding:20px 20px 20px 20px;border-radius:4px 4px 0px 0px;color:#111111;font-family:Helvetica,Arial,sans-serif">
                            <h1 style="font-size:24px;font-weight:bold;margin:0">મહાકાલ સેવા સેના ટ્રસ્ટ</h1>
                            <h1 style="font-size:16px;font-weight:400;margin:0">smsstrust9@gmail.com |  07202043999</h1>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>

    <tr>
        <td bgcolor="#dfe3ec" align="center" style="padding:0px 10px 0px 10px">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                <tbody>
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding:20px 30px 30px 30px;color:#666666;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:25px">
                            <div>
                                Recipt Id: ##ReciptId##
                            </div>
                            <div>Date of Donation : ##Date##</div>
                            <div>Donor Name : ##Name##</div>
                            <div>Donation Amount : ##Amount##</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>

    <tr>
        <td bgcolor="#dfe3ec" align="center" style="padding:0px 10px 0px 10px">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                <tbody>
                    <tr>
                        <td bgcolor="#111111" align="left"
                            style="padding:10px 30px;color:#b6b3bd;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;border-radius:0px 0px 4px 4px">
                            તમારા દાન બદલ આભાર
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>

    <tr>
        <td bgcolor="#dfe3ec" align="center" style="padding:10px 10px 15px 10px">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                <tbody>
                    <tr>
                        <td bgcolor="#111111" align="center"
                            style="padding:5px 30px 5px 30px;border-radius:4px 4px 4px 4px;color:#e4edfd;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:400;line-height:25px">
                            2024 shree mahakal seva sena trust
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
</tbody>
</table>`


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

const newDonation = catchAsync(async (req, res) => {

    let newDonationId
    const newAddedDonation = await Donations.create(req.body);
    if (newAddedDonation) {
        newDonationId = newAddedDonation._id
    }

    let date;
    if (typeof newAddedDonation.createdAt === 'string') {
        date = newAddedDonation.createdAt
            .split('T')[0]
            .split('-')
            .reverse().join('-');
    }

    const custommerPlaceholders = {
        "##ReciptId##": newAddedDonation.donationId,
        "##Date##": new Date(newAddedDonation.createdAt),
        "##Name##": newAddedDonation.name,
        "##Amount##": `${newAddedDonation.amount} ₹`,

    };

    let updatedTemplate = replacePlaceholders(
        reciptTemplate,
        custommerPlaceholders
    );
    const convertedFile = await convertAndSavePDF(updatedTemplate, `${newAddedDonation.donationId}.pdf`)
    console.log(convertedFile)
    const updated = await Donations.findByIdAndUpdate(newAddedDonation._id, { donationRecipt: convertedFile, donationReciptHTML: updatedTemplate })

    console.log(updated)

    console.log("donation response___>", newAddedDonation)
    const merchant_id = process.env.PHONEPAY_MERCHANT_ID;
    const salt_key = process.env.PHONEPAY_SALT_KEY;

    const merchantTransactionId = req.body.transactionId;
    const data = {
        merchantId: merchant_id,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: req.body.MUID,
        name: req.body.name,
        amount: req.body.amount * 100,
        redirectUrl: `http://localhost:8000/api/v1/donate/status/${merchantTransactionId}`,
        redirectMode: 'POST',
        mobileNumber: req.body.phone.toString(),
        paymentInstrument: {
            type: 'PAY_PAGE',
        },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString('base64');
    const keyIndex = 1;
    const string = payloadMain + '/pg/v1/pay' + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    const test_URL =
        'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
    const options = {
        method: 'POST',
        url: test_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
        },
        data: {
            request: payloadMain,
        },
    };
    console.log(payloadMain);
    const response = await axios(options);

    const updatedDonatoin = await Donations.findByIdAndUpdate(newAddedDonation._id, { IspaymentSuccess: response.success })
    if (response.data.success === true) {
        const url = response.data.data.instrumentResponse.redirectInfo.url;
        console.log('Response of payment:', response.data);
        console.log('Data:', response.data.data.instrumentResponse);
        return res.status(200).json({ url: url });
    } else {
        console.error('Payment request failed:', response.data);
        res.status(500).json({
            message: 'Payment request failed',
            success: false,
        });
    }
});

const checkStatus = async (req, res) => {
    try {


        const merchantTransactionId = req.params.transactionId;
        const merchantId = process.env.PHONEPAY_MERCHANT_ID;

        return res.redirect(process.env.REMOTE + "/donation-recipt/" + merchantTransactionId);
        const keyIndex = 1;
        const string = `/v3/transaction/${merchantId}/${merchantTransactionId}/status${process.env.PHONEPAY_SALT_KEY}`;

        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;

        console.log("x - varify", checksum)
        const options = {
            method: 'get',
            url: `https://mercury-uat.phonepe.com/enterprise-sandbox/v3/transaction/${merchantId}/${merchantTransactionId}/status`
            // url: `https://apps-uat.phonepe.com/v3/transaction/${merchantId}/${merchantTransactionId}/status`,
            , headers: {
                accept: 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': `${merchantId}`
            },

        };


        console.log(options)
        const response = await axios.request(options);

        if (response.data.success === true) {
            return res.redirect(getSuccessRedirectURL());
        } else {
            return res.redirect(getFailureRedirectURL());
        }
    } catch (error) {
        console.error("Error in checkStatus:", error?.response?.data || error);

        return res.status(500).send("Internal Server Error");
    }
};

const getSuccessRedirectURL = () => {

    return process.env.REMOTE;
};

const getFailureRedirectURL = () => {

    return `https://pushtishangar.com/failure`;
};

const getDOnationById = catchAsync(async (req, res, next) => {
    const recordExists = await Donations.findOne({ transactionId: req.params.id });
    if (!recordExists) {

        return next(new appError(`Gallary item not found`, 400));
    } else {
        console.log(recordExists)
        res.status(200).send({ reciptPath: `${process.env.DEPLOYMENT_URL}/api/v1/donation-ricipt/${recordExists.donationRecipt}`, reciptHTML: recordExists.donationReciptHTML });
    }
});


module.exports = {
    newDonation,
    checkStatus,
    getDOnationById
}