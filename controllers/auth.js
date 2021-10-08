const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

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

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // we aren't saying no user found, cuz user shouldn't know that
      return next(new ErrorResponse('Email could not be sent', 404));
    }

    const resetToken = user.getResetPasswordToken();

    // we call save here, the check we added in pre save runs, cuz we haven't
    // done anything to the password
    await user.save();

    // create reset password url
    const resetUrl = `${process.env.FRONTEND}/${resetToken}`;

    // create email to be sent
    // clicktracking off means that annoying redirect to unnnecessary links can be removed
    // when reset url clicked on
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message
      });

      res.status(200).json({ data: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
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
