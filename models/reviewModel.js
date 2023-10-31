const mongoose = require('mongoose');
const Tour = require('./tourModel');
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
  // this.populate({
  //     path: 'tour',
  //     select: 'name'
  // }).populate({
  //     path: 'user',
  //     select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourID) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourID }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  // Review.calcAverageRatings(this.tour); //! will give an error because the Review is not initializing yet
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) { // next: because it's pre-middleware
  //! the goal is to to get access to the current review document
  // this: points to current Schema not to the current review document
  this.r = await this.findOne(); // To get access to the current review document, we will wait Execution of query
  console.log(this.r);
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
  // we use pre to passing data from pre-middleware to post-middleware
  // by creating new property for this called r --> this.r = ....
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;