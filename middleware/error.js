const ErrorResponse = require('../utils/errorResponse');

// A generic erroHandler that can be used with mongoose
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // code from mongoose
  if (err.code === 11000) {
    const message = 'Duplicate Field Value';
    error  = new ErrorResponse(message, 400);
  }

  if (err.name  === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
}

module.exports = errorHandler;