const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    
    return res.status(200).json({
        status: "Success",
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    return res.status(201).json({
        status: "Success",
        data: {
            review: newReview
        }
    });
})