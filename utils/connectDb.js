const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const db =
      process.env.NODE_ENV === "development"
        ? process.env.DB_DEV
        : process.env.DB_PROD;
    await mongoose.connect(db);
  } catch (error) {
    process.exit(1);
  }
};
