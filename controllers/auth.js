const { User } = require('../models/User');

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

exports.login = async (req, res, next) => {
  const { email, password, } = req.body;


  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: 'Please provide username and password',
    });
  }

  try {
    // we ignored the password in the schema, if we want it we should now explicitly select
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      res.status(404).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    res.status(200).json({
      success: true,
      token: 'willaddtokensoon',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

exports.forgotPassword = (req, res, next) => {
  res.send('Forgot Password route');
}

exports.resetPassword = (req, res, next) => {
  res.send('Reset password route');
}