const express = require('express');
const authController = require('../controllers/authController');
const { decodeTokenMiddleware } = require('../middlewere/decodeTokenMiddleware');

const Router = express.Router();

Router.post('/login', authController.loginUser);
Router.post('/createUser', authController.createUser);
Router.get('/getLoggedInUser',decodeTokenMiddleware, authController.getLoggedInUser);


module.exports = Router;
