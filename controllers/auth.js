const User = require('../models/User');

exports.register = async (req, res, next) => {
  const { username, email, password, } = req.body;

  try {
    const user = await User.create({
      username, email, password
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

exports.login = (req, res, next) => {
  res.send('Login route');
}

exports.forgotPassword = (req, res, next) => {
  res.send('Forgot Password route');
}

exports.resetPassword = (req, res, next) => {
  res.send('Reset password route');
}