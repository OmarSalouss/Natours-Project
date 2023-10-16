const Tour = require('../models/tourModel');

//! (req, res) => { } : this callback function will run inside in eventloop
//! so here we can't have any block in code
exports.getAllTours = async (req, res) => {
    try {
        //! BUILD QUERY
        // 1A) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => { delete queryObj[el] });
        console.log(req.query, queryObj);

        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log("***************");
        console.log(JSON.parse(queryStr));
        console.log(queryStr);
        console.log("***************");

        let query = Tour.find(JSON.parse(queryStr));

        // 2) Sorting
        // sort=price  // Descending Order
        // sort=-price // Ascending Order
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy);
            // Examdple: URI (/?sort=-price,ratingsAverage) then become like this //! sort('-price ratingsAverage')
            // price --> Ascending Order //! then if two price or more are equal make order based on ratingsAverage --> Descending Order
            // Examdple: URI (/?sort=-price,-ratingsAverage) then become like this //! sort('-price -ratingsAverage')
            // price --> Ascending Order //! then if two price or more are equal make order based on ratingsAverage --> Ascending Order
        } else {
            query = query.sort('-createdAt');
        }
        //! EXECUTE QUERY
        const tours = await query;

        //! SEND RESPONSE
        res.status(200).json({
            status: "Success",
            results: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (error) {
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