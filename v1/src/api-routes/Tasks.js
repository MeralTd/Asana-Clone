//validate middleware
const validate = require("../middlewares/validate");
const authenricateToken = require("../middlewares/authenticate");
//validations
const schemas = require("../validations/Tasks");
const express = require("express");
const TaskController = require("../controllers/Task");
const router = express.Router();
const idChecker = require("../middlewares/idChecker");

router.route("/:id").get(idChecker(), authenricateToken, TaskController.fetchTask);
router.route("/").post(authenricateToken, validate(schemas.createValidation), TaskController.create);
router.route("/:id").patch(idChecker(), authenricateToken, validate(schemas.updateValidation), TaskController.update);
router.route("/:id").delete(idChecker(), authenricateToken, TaskController.deleteTask);
router.route("/:projectId").get(authenricateToken, TaskController.index);

router.route("/:id/make-comment").post(idChecker(), authenricateToken, validate(schemas.createCommentValidation), TaskController.makeComment);
router.route("/:id/add-sub-task").post(idChecker(), authenricateToken, validate(schemas.createValidation), TaskController.addSubTask);
router.route("/:id/:commentId").delete(idChecker(), authenricateToken, TaskController.deleteComment);

module.exports =  router;