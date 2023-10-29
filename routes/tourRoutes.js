const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/route-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);
// .post(catchAsync(tourController.createTour)); // i can add catchAsync here but not recommended.
// because maybe create wrong because put this with async functions only

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.detetTour
    );

router
    .route('/:tourId/reviews')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );
module.exports = router;
