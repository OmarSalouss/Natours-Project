const Tour = require('../models/tourModel');

//! (req, res) => { } : this callback function will run inside in eventloop
//! so in here we can't have any block in code
exports.checkBody = (req, res, next) => {
    // if (!req.body.name || !req.body.price) {
    //     return res.status(400).json({
    //         status: 'fail',
    //         message: 'fail name or price'
    //     });
    // }
    // next();
    try {
        const { name, price } = req.body;
        console.log(`Tour body is :${req.body}`);
        if (name !== "" && !Number.isInteger(price)) {
            return res.status(400).json({
                status: 'fail',
                message: 'fail'
            });
        }
        next();
    } catch (error) {
        console.log("Error 😀")
    }

};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "Success",
        // results: tours.length,
        // data: {
        //     tours: tours
        // }
    });
};
exports.getTour = (req, res) => {
    console.log(req.params);
    console.log(req.requestTime);
    console.log(new Date().toISOString());
    const id = req.params.id * 1; //! To convert String to Number (Easy Trick)
    // const tour = tours.find(el => el.id === id);

    // res.status(200).json({
    //     status: "Success",
    //     results: tours.length,
    //     requestAT: req.requestTime,
    //     data: {
    //         tour: tour
    //     }
    // });
};
exports.createTour = (req, res) => {
    res.status(201).json({
        status: "Success",
        // data: {
        //     tours: newTour
        // }
    });
};
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: "Success",
        data: {
            tour: '<Updated tour here..>'
        }
    })
};
exports.detetTour = (req, res) => {
    res.status(204).json({
        status: "Success",
        data: null
    });
};