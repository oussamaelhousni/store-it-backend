const { ZodError } = require("zod");

module.exports = (schema) => {
  return (req, res, next) => {
    try {
      const data = schema.parse(req.body);
      req.body = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = {};
        error.errors.forEach((error) => {
          details[error.path[0]] = error.message;
        });
        return res.status(400).json({
          error: "Invalid Data",
          details,
        });
      }

      return res.status(500).json({
        message: "Something went wrong, please try again later",
      });
    }
  };
};
