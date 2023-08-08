//validate middleware
const validate = require("../middlewares/validate");
const authenricateToken = require("../middlewares/authenticate");
//validations
const schemas = require("../validations/Sections");
const express = require("express");
const { index, create, update, deleteSection } = require("../controllers/Sections");
const router = express.Router();

router.route("/:projectId").get(authenricateToken, index);
router.route("/").post(authenricateToken, validate(schemas.createValidation), create);
router.route("/:id").patch(authenricateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenricateToken, deleteSection);

module.exports =  router;