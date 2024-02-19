const express = require('express');
const { newDonation, checkStatus } = require('../controllers/DonateController');
const router = express();

router.post('/', newDonation);
router.post('/status/:transactionId', checkStatus);

module.exports = router;
