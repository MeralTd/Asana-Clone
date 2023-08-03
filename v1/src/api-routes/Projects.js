//validations
//validate middleware
const express = require("express");
const { index, create, update, deleteProject} = require("../controllers/Projects");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Projects");
const authenricateToken = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").get(authenricateToken, index);
router.route("/").post(authenricateToken, validate(schemas.createValidation), create);
router.route("/:id").patch(authenricateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenricateToken, deleteProject);

module.exports =  router;