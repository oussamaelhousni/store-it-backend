const { promisify } = require("node:util");
const jwt = require("jsonwebtoken");

// turn jwt.sign to promise based function
const sign = promisify(jwt.sign);

module.exports = async (userId) => {
  const [access, refresh] = await Promise.all([
    sign({ id: userId }, process.env.ACCES_TOKEN_SECRET, { expiresIn: "3m" }),
    sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1m" }),
  ]);
  return [access, refresh];
};
