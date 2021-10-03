const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,

    // make it required, and supply an error message
    required: [true, 'Please provide a username'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a user email'],

    // all emails must be unique
    unique: true,

    // much match with this regex
    match: [
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,

    // whenever, we query a user don't select and return the password too
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// run this middleware prior to saving
// function() must be used for the this keyword
userSchema.pre('save', async function(next) {
  // if password is there, n we r updating, no use of hashing it again
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);

  // this.password is the password we pass in User.create(),
  // the 'this' that is available here is the User object we pass
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// check if password matches this created user
userSchema.methods.matchPasswords = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.getSignedToken = function() {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN, }, );
}

const User = mongoose.model('User', userSchema);
module.exports = {
  User,
}