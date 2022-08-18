const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const morgan = require('morgan');
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorContoller');

// serving  static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//MIDDLEWAREs
//Set security http headers
app.use(helmet());

//devlopment logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limiting request from same IP
const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: 'Too many requests from this IP,please try again in an hour!',
});
app.use('/api', limiter);
//BODY PARSER reading data ffrom the body into req.body
app.use(express.json({ limit: '10kb' }));
//Data sanitazation against NOSQL query injection
app.use(mongoSanitize());
//Data sanitazation against cROSS SITE SCRIPTING
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// Pug Handler Function
app.use('/', viewRouter);

//Api Handler function
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server !`, 404));
});

app.use(errorController);

module.exports = app;
