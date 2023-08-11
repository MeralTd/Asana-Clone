//validate middleware
const validate = require("../middlewares/validate");
const authenricateToken = require("../middlewares/authenticate");
//validations
const schemas = require("../validations/Sections");
const express = require("express");
const SectionContoller = require("../controllers/Section");
const router = express.Router();

router.route("/:projectId").get(authenricateToken, SectionContoller.index);
router.route("/").post(authenricateToken, validate(schemas.createValidation), SectionContoller.create);
router.route("/:id").patch(authenricateToken, validate(schemas.updateValidation), SectionContoller.update);
router.route("/:id").delete(authenricateToken, SectionContoller.deleteSection);

module.exports =  router;