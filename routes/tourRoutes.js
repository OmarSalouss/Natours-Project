const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoute');

const router = express.Router();

// router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/route-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour);

router
    .route('/tours-within/:distance/center/:lating/unit/:unit')
    .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.detetTour
    );

module.exports = router;
