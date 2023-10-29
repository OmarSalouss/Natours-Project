const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST tours/12345/reviews <-- same to --> POST /reviews
// GET  tours/12345/reviews <-- same to --> GET  /

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );

router
    .route('/:id')
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;