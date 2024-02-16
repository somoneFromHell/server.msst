const express = require('express');
const { newPayment, checkStatus } = require('../controllers/paymentController');
const router = express();

router.post('/', newPayment);
router.post('/status/:transactionId', checkStatus);

module.exports = router;
