const { MongooseError } = require("mongoose");
const { userModel } = require("../models");
const {
  asyncHandler,
  sendEmail,
  otpGenerator,
  generateTokens,
} = require("../utils");

/*
    @route: /api/v1/users/register
    @description: Create new user account
    @access: Public
    @method: Post
*/
exports.createAccount = asyncHandler(async (req, res, next) => {
  try {
    const newUser = await userModel.create(req.body);

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
    @method: Post
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

/*
    @route: /api/v1/users/login
    @description: send otp to user
    @access: Public
    @method: Post
*/
exports.login = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email, isConfirmed: false });
  if (!user) {
    return res.status(200).json({
      error: "User not found or not confirmed his account yet",
    });
  }
  user.otp = otpGenerator();
  user.otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  /* await sendEmail({
    to: user.email,
    subject: "Otp",
    text: `Otp : ${user.otp}`,
  }); */

  return res.status(200).json({
    data: {
      userId: user._id,
    },
  });
});

/*
    @route: /api/v1/users/verify
    @description: verify otp
    @access: Public
    @method: Post
*/
exports.verifyotp = asyncHandler(async (req, res, next) => {
  const { otp, userId } = req.body;
  const user = await userModel.findOne({
    otp,
    _id: userId,
    otpExpiredAt: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      error: "Otp expired or Invalid",
    });
  }

  user.otp = "";
  user.otpExpiredAt = null;
  await user.save();

  const [accessToken, refreshToken] = await generateTokens(user._id);

  // set refrech token in httpOnly cookie
  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  // set access token in the cookie
  res.cookie("access", refreshToken, { maxAge: 3 * 1000 });

  return res.status(200).json({
    message: "Logged in successfully",
    data: { accessToken }, // send access token with data as well in case there is diffrent implementation in future
  });
});
