const router = require("express").Router();
const { userController } = require("../controllers");
const { validate } = require("../middleware");
const { registerSchema } = require("../schemas");

router
  .route("/register")
  .post(validate(registerSchema), userController.createAccount);

router.route("/confirm/:confirmationId").get(userController.confirmAccount);

router.route("/login").post(userController.login);

router.route("/verify").post(userController.verifyotp);

module.exports = router;
