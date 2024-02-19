const express = require('express');
const donationController = require('../controllers/donationController');

const Router = express.Router();

Router.get('/:id', donationController.getDonation);
Router.delete('/:id', donationController.deleteDonation);

Router.post('/', donationController.addDonation);
Router.get('/', donationController.getAllDonations);


module.exports = Router;
