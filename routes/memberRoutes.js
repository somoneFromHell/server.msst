const express = require('express');
const MemberController = require('../controllers/membersController');
const multer = require("multer");
const Router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "Uploads/Member-Images/");
    },
    filename: (req, file, cb) => {
      const originalFileName = file.originalname;
      const extension = originalFileName.split(".").pop();
      const newFileName = `${Date.now()}_member_image.${extension}`;
      cb(null, newFileName);
    },
  });
  
  const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: imageFileFilter });


Router.get('/:id', MemberController.getMember);
Router.delete('/:id', MemberController.deleteMember);
Router.put('/AcceptRequest/:id', MemberController.AcceptRequest);

Router.post('/',upload.single("image"), MemberController.addMember);
Router.get('/', MemberController.getAllMembers);


module.exports = Router;
