const { User } = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
  const { username, email, password, } = req.body;

  try {
    const user = await User.create({
      username, email, password
    });

    sendToken(user, 201, res);
  } catch (err) {
    // res.status(500).json({
    //   success: false,
    //   error: err.message,
    // });
    next(err);
  }
}

exports.login = async (req, res, next) => {
  const { email, password, } = req.body;


  if (!email || !password) {
    // res.status(400).json({
    //   success: false,
    //   error: 'Please provide email and password',
    // });
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  try {
    // we ignored the password in the schema, if we want it we should now explicitly select
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // res.status(401).json({
      //   success: false,
      //   error: 'Invalid credentials',
      // });
      return next(new ErrorResponse('Please provide valid credentials', 401));
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      // res.status(401).json({
      //   success: false,
      //   error: 'Invalid credentials',
      // });
      return next(new ErrorResponse('Please provide valid credentials', 401));
    }

    sendToken(user, 200, res);
  } catch (err) {
    // res.status(500).json({
    //   success: false,
    //   error: err.message,
    // });
    next(err);
  }
}

exports.forgotPassword = (req, res, next) => {
  res.send('Forgot Password route');
}

exports.resetPassword = (req, res, next) => {
  res.send('Reset password route');
}

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
  });
}