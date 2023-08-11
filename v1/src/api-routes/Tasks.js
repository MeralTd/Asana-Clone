//validate middleware
const validate = require("../middlewares/validate");
const authenricateToken = require("../middlewares/authenticate");
//validations
const schemas = require("../validations/Tasks");
const express = require("express");
const TaskController = require("../controllers/Task");
const router = express.Router();

router.route("/:id").get(authenricateToken, TaskController.fetchTask);
router.route("/:projectId").get(authenricateToken, TaskController.index);
router.route("/").post(authenricateToken, validate(schemas.createValidation), TaskController.create);
router.route("/:id").patch(authenricateToken, validate(schemas.updateValidation), TaskController.update);
router.route("/:id").delete(authenricateToken, TaskController.deleteTask);

router.route("/:id/make-comment").post(authenricateToken, validate(schemas.createCommentValidation), TaskController.makeComment);
router.route("/:id/add-sub-task").post(authenricateToken, validate(schemas.createValidation), TaskController.addSubTask);
router.route("/:id/:commentId").delete(authenricateToken, TaskController.deleteComment);

module.exports =  router;