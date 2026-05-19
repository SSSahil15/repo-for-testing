const { ZodError } = require("zod");

/**
 * Higher-order function that returns an Express middleware to validate request
 * parameters against a provided Zod schema.
 *
 * @param {import("zod").ZodSchema} schema
 * @param {"body"|"query"|"params"} property
 */
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    try {
      // Parse and replace the request property with the validated/sanitized data
      req[property] = schema.parse(req[property]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors.map(e => ({
            field: e.path.join("."),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
};

module.exports = validate;
