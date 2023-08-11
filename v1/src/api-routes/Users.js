const express = require("express");
const UserController = require("../controllers/User");
const validate = require("../middlewares/validate");
const authenricateToken = require("../middlewares/authenticate");

const schemas = require("../validations/Users")
const router = express.Router();
const idChecker = require("../middlewares/idChecker");

router.get("/", UserController.index);
router.route("/").post(validate(schemas.createValidation), UserController.create);
router.route("/").patch(authenricateToken, validate(schemas.updateValidation), UserController.update);
router.route("/:id").delete(idChecker(), authenricateToken, UserController.deleteUser);
router.route("/login").post(validate(schemas.loginValidation), UserController.login);
router.route("/projects").get(authenricateToken, UserController.projectList);
router.route("/change-password").post(authenricateToken, validate(schemas.changePasswordValidation), UserController.changePassword);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), UserController.resetPassword);
router.route("/update-profile-image").post(authenricateToken, UserController.updateProfileImage);

module.exports =  router;
