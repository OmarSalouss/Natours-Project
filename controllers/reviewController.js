const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    return res.status(200).json({
        status: "Success",
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    // Allow nested roites
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    return res.status(201).json({
        status: "Success",
        data: {
            review: newReview
        }
    });
})

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);