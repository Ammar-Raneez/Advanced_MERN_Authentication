// Custom Error
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    // set actual error message from parent as message
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
