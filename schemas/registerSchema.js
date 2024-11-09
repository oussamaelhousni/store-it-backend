const { z } = require("zod");

module.exports = z.object({
  email: z.string().email(),
  fullName: z.string(),
});
