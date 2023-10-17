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
            // Examdple: URI (/..?sort=-price,ratingsAverage) then become like this //! sort('-price ratingsAverage')
            // price --> Ascending Order //! then if two price or more are equal make order based on ratingsAverage --> Descending Order
            // Examdple: URI (/?sort=-price,-ratingsAverage) then become like this //! sort('-price -ratingsAverage')
            // price --> Ascending Order //! then if two price or more are equal make order based on ratingsAverage --> Ascending Order
        } else {
            query = query.sort('-createdAt'); // Default Sort
        }

        // 3) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v'); //select everything exclude (__v) because i put '-'
        }

        // 4) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        //URI (/..?page=2&limit=10), 1-10 in page 1,  11-20 in page 2,  21-30 in page 3, etc ....
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            console.log(numTours);
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        //! EXECUTE QUERY
        const tours = await query;
        // query.sort().select().skip().limit()

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