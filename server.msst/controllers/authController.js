const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");



module.exports.loginUser = catchAsync(async (req, res, next) => {
    var { email, password } = new userModel(req.body);
    if (!email || !password)
      return next(new appError(`provide proper credentials`, 400));
  
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return next(new appError(`incorrect credentials`, 401));
  
    const validPassword = (req.body.password === user.password);
    if (!validPassword) return next(new appError(`incorrect credentials`, 401));
  

  
    const token = jwt.sign({ userId: user._id }, "jwtPrivateKey", {
      expiresIn: "1d",
    });
    res.header("Authorization", token).send(token);
  });


  module.exports.createUser = catchAsync(async (req, res, next) => {
    const { firstName, lastName, middleName, email, password, role } = req.body;
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
     return next(new appError(`'${req.body.email}' email already taken`, 400));
    }
  

    const newUser = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      password: password,
      profileImage: req.file ? req.file.filename : "not given",
    };
    const savedUser = await userModel.create(newUser);
    res.status(201).json(savedUser);
  });


  module.exports.getLoggedInUser = catchAsync(async(req,res)=>{
    const userId = req.user;

    const user = await userModel.findById(userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  })