const mongoose = require('mongoose');
// const Tour = require('./tourModel');
// const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty']
        },
        rating: {
            type: Number,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0']
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next) {
    const query = [
        {
            path: 'tour',
            select: 'name'
        },
        {
            path: 'user',
            select: 'name role'
        }
    ];
    // 1)
    // this.populate(
    //     [
    //         { path: 'tour' },
    //         { path: 'user' }
    //     ]
    // );

    // 2)
    // this.populate(query);
    this.populate({
        path: 'tour',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;