const mongoose = require("mongoose");
const validator = require("validator");
const uuid = require("uuid");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: [true],
  },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  confirmationId: {
    type: String,
    default: uuid.v4,
  },
  isConfirmed: {
    type: Boolean,
    default: "false",
  },
  otp: String,
  otpExpiredAt: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },

  lastLoginAt: Date,
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
