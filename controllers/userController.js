const { MongooseError } = require("mongoose");
const { userModel } = require("../models");
const { asyncHandler, sendEmail } = require("../utils");

/*
    @route: /api/v1/users/register
    @description: Create new user account
    @access: Public
*/
exports.createAccount = asyncHandler(async (req, res, next) => {
  try {
    const newUser = await userModel.create(req.body);

    console.log("hi", {
      to: newUser.email,
      subject: "Store it account creation",
      text: `${process.env.API_URL}/api/v1/users/confirm/${newUser.confirmationId}`,
    });
    await sendEmail({
      to: newUser.email,
      subject: "Store it account creation",
      text: `${process.env.API_URL}/api/v1/users/confirm/${newUser.confirmationId}`,
    });
    return res.status(201).json({
      message: "account created",
      data: "data",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Account already exists",
      });
    }
    throw error;
  }
});

/*
    @route: /api/v1/users/confirm/:confirmationId
    @description: Confirm newly created account
    @access: Public
*/
exports.confirmAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    confirmationId: req.params.confirmationId,
    isDeleted: false,
  });

  if (!user) {
    return res.status(400).json({
      error: "Invalid confirmation link",
    });
  }

  if (!user.isConfirmed) {
    user.isConfirmed = true;
    await user.save();
  }

  return res.status(301).redirect(process.env.FRONTEND_URL);
});
