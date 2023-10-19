const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        //! EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        console.log("******************************************************* 1")
        const tours = await features.query;
        console.log("******************************************************* 2")

        //! SEND RESPONSE
        res.status(200).json({
            status: "Success",
            results: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "fail",
            message: error
        });
    }
};
exports.getTour = async (req, res) => {
    try {
        console.log(req.params);
        console.log(req.requestTime);
        console.log(new Date().toISOString());
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ _id : req.params.id })

        res.status(200).json({
            status: "Success",
            results: tour.length,
            requestAT: req.requestTime,
            data: {
                tour: tour
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        });
    }
};
exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({});
        // newTour.save();

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "Success",
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        });
    }
};
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "Success",
            data: {
                tour: tour
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
};
exports.detetTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "Success",
            data: {
                tour: null
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    // _id: '$ratingsAverage', 
                    _id: { $toUpper: '$difficulty' },
                    num: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minProce: { $min: '$price' },
                    maxProce: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
            // , {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ])
        res.status(200).json({
            status: "Success",
            data: {
                stats
            }
        });

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // 2021
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTours: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTours: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: "Success",
            length: plan.length,
            data: {
                plan
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        });
    }
}