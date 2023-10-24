const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIERS_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

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
  if (!token) {
    return next(new AppError('You are not logged in! Please Log in to get access.', 401));
  }

  // 2) Verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPassordAfter(decode.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401))
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array --> roles = ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not habe permission to perform this action', 403)); // 403 mean Forbidden
    }

    next();
  }
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user bvased on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  // 2) Generate the eandom reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });


  // 3) Send it to user's use email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  console.log(resetURL);

  const message = `Forgot your password? Submit a PATCH request with your new password and
  passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Token sent to email'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    return next(new AppError('There was an error to sending the email. Try again later!', 500));
  }

});

// exports.resetPassword = catchAsync((req, res, next) => { });