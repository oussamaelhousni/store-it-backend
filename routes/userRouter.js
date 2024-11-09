const router = require("express").Router();
const { userController } = require("../controllers");
const { validate } = require("../middleware");
const { registerSchema } = require("../schemas");

router
  .route("/register")
  .post(validate(registerSchema), userController.createAccount);

router.route("/confirm/:confirmationId").get(userController.confirmAccount);

module.exports = router;
