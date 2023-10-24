const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIERS_IN
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  console.log(newUser);

  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser
    }
  })
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if eamil and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) Check if user exsits && password is correct
  const user = await User.findOne({ email }).select('+password');
  // if user exist then can run await user.correctPassword(password, user.password)
  if (!user || !await user.correctPassword(password, user.password)) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everthing ok, send token to client
  const token = signToken(user.id);
  console.log(token)
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(new AppError('You are not logged in! Please Log in to get access.', 401));
  }
  // 2) Verification token

  // 3) Check if user still exists

  // 4) Check if user changed password after the token was issued


  next();
});