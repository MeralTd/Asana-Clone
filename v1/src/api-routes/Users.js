const express = require("express");
const { create, index, login, projectList, resetPassword, update, deleteUser, changePassword, updateProfileImage} = require("../controllers/Users");
const validate = require("../middlewares/validate");
const authenricateToken = require("../middlewares/authenticate");

const schemas = require("../validations/Users")
const router = express.Router();

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router.route("/").patch(authenricateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenricateToken, deleteUser);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/projects").get(authenricateToken,projectList);
router.route("/change-password").post(authenricateToken, validate(schemas.changePasswordValidation), changePassword);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPassword);
router.route("/update-profile-image").post(authenricateToken, updateProfileImage);

module.exports =  router;
