class AppError extends Error {
  constructor(message = "something went wrong", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
