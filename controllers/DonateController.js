const crypto = require('crypto');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const Donations = require('../Models/donationModel');

const newDonation = catchAsync(async (req, res) => {

    let newDonationId
    const newAddedDonation = await Donations.create(req.body);
    if (newAddedDonation) {
        newDonationId = newAddedDonation._id
    }

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
        redirectUrl: `http://localhost:3000/paymentStatus/${merchantTransactionId}`,
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

    const updatedDonatoin = Donations.findByIdAndUpdate(newAddedDonation, { IspaymentSuccess: response.success })
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
                accept: 'text/plain',
                'X-VERIFY': checksum,
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
        console.error("Error in checkStatus:", error.response.data);

        return res.status(500).send("Internal Server Error");
    }
};

const getSuccessRedirectURL = () => {

    return `https://pushtishangar.com/success`;
};

const getFailureRedirectURL = () => {

    return `https://pushtishangar.com/failure`;
};


module.exports = {
    newDonation,
    checkStatus
}