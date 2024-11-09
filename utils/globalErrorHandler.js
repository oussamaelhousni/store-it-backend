module.exports = (error, req, res, next) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  // TODO : do not forget to remove error message from response
  return res.status(500).json({ error: error.message });
};
