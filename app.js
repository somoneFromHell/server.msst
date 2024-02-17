const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const fs = require("fs");

const donationRouter = require('./routes/donationRoutes');
const memberRouter = require('./routes/memberRoutes');
const authRouter = require('./routes/authRouts');
const paymentRouter = require('./routes/paymentRouts');
const bannerRouter = require('./routes/bannerRoutes')
const galleryRouter = require('./routes/galleryRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

dotenv.config({ path: './.env' }); 


console.log('REMOTE: ', process.env.REMOTE);

app.use(cors());
app.options(process.env.REMOTE, cors());

console.log(`ENV = ${process.env.NODE_ENV}`);
app.use(morgan('dev')); 

const limiter = rateLimit({
    max: 1000, 
    windowMs: 60 * 60 * 1000,
    message:
        '!!! Too many requests from this IP, Please try again in 1 hour !!!',
});

app.use('/api/v1', limiter);

app.use((req, res, next) => {
 

    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    if (req.cookies) console.log(req.cookies);
    next();
});

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' })); 

app.use(mongoSanitize()); 
app.use(xss()); 

app.use(compression());

app.use('/api/v1/member-img', express.static('Uploads/Member-Images'));
app.use('/api/v1/banner-img', express.static('Uploads/banner'));

app.use('/api/v1/donations', donationRouter);
app.use('/api/v1/members', memberRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/gallery', galleryRouter);
app.use('/api/v1/banner', bannerRouter);



app.get("/", (req, res) => {
  fs.readFile("serverOk.html", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading HTML file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send("data");
    }
  });
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(errorController);

module.exports = app;
