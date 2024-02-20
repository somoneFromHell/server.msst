const express = require('express');
const { newDonation, checkStatus, getDOnationById } = require('../controllers/DonateController');
const router = express();

router.post('/', newDonation);
router.post('/status/:transactionId', checkStatus);
router.get('/:id', getDOnationById);

module.exports = router;
