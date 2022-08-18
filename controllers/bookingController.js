const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModels');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  //1)Get the current user
  const tour = await Tour.findById(req.params.tourid);
  //2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourid
    }&user=${req.params.userid}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });
  //3) create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) {
    const booking = await Booking.create({ tour, user, price });
    res.status(201).json({
      sucess: true,
      booking,
    });
  }
});
exports.createBooking = factory.createOne(Booking);
exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
