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
        const tours = await features.query;

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
        })
    }
};