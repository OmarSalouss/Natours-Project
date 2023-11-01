const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build Template

    // 1)

    res.status(200).render('overview', {
        title: 'All Tour',
        tours
    });
});

exports.getTour = (req, res, next) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
};