const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`./dev-data/data/tours-simple.json`)
);

exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defiend'
    });
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defiend'
    });
};
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defiend'
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defiend'
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defiend'
    });
};
