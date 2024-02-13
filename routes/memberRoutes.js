const express = require('express');
const MemberController = require('../controllers/membersController');

const Router = express.Router();


Router.get('/:id', MemberController.getMember);
Router.delete('/:id', MemberController.deleteMember);
Router.put('/AcceptRequest/:id', MemberController.AcceptRequest);

Router.post('/', MemberController.addMember);
Router.get('/', MemberController.getAllMembers);


module.exports = Router;
