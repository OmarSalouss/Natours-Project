const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

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
app.use(express.json({ limit: '10kb' }));// of body larger than 10KB, it basically not be accepted

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