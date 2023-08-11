//validations
//validate middleware
const express = require("express");
const ProjectContoller = require("../controllers/Project");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Projects");
const authenricateToken = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");
const router = express.Router();

router.route("/").get(authenricateToken, ProjectContoller.index);
router.route("/").post(authenricateToken, validate(schemas.createValidation), ProjectContoller.create);
router.route("/:id").patch(idChecker(), authenricateToken, validate(schemas.updateValidation), ProjectContoller.update);
router.route("/:id").delete(idChecker(), authenricateToken, ProjectContoller.deleteProject);

module.exports =  router;