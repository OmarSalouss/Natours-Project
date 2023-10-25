const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) GLOBAL MIDDLEWARE
// Set Secuirity HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//  allow here is basically, 100 requests per hour.
// one hour so 60 minutes, times 60 for seconds, times 1,000 for milliseconds.
// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // allow 100 requests from the same IP in one hour.
    message: 'Too many request from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// Body parser, reading date from body into req.body
app.use(express.json({ limit: '10kb' }));// if body larger than 10KB, it basically not be accepted

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());//! So, what this middleware does? is to look at the request body, the request query string,
//! and also at Request.Params, and then it will basically filter out all of the dollar signs and dots,
//! because that's how MongoDB operators are written. By removing that, well, these operators are then no longer going to work.
//! Ex: send email in body of Login API like this --> "email": {"$gt":""} . Then will Return All Documnets
//! So this middleware will transfer email to email= {}

// Data Sanitization against XSS
app.use(xss());//! This will then clean any user input from malicious HTML code
//! Ex: send name in body of SignUp API Like this --> "name": "<div id='bad-cod'>Name</div>"
//! So this middleware will transfer name to "name": "&lt;div id='bad-cod'>Name&lt;/div>"

// Prevent Parameter Pollution
app.use(hpp());//! if user same params name more than one then will give err, so we use this middleware to take last one
//! Ex: api/v1/tours?sort=price&sort=duration 
//! then will take only sort=duration and create sort based on duration
// app.use(
//     hpp({
//         whitelist: [
//             'duration',
//             'ratingsAverage',
//             'ratingsQuantity',
//             'maxGroupSize',
//             'difficulty',
//             'price'
//         ]
//     })
// );

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toUTCString();
    next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;