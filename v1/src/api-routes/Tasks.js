//validate middleware
const validate = require("../middlewares/validate");
const authenricateToken = require("../middlewares/authenticate");
//validations
const schemas = require("../validations/Tasks");
const express = require("express");
const { index, create, update, deleteTask, makeComment, deleteComment, addSubTask, fetchTask } = require("../controllers/Tasks");
const router = express.Router();


router.route("/").get(authenricateToken, index);
router.route("/").post(authenricateToken, validate(schemas.createValidation), create);
router.route("/:id").patch(authenricateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenricateToken, deleteTask);

router.route("/:id/make-comment").post(authenricateToken, validate(schemas.createCommentValidation), makeComment);
router.route("/:id/add-sub-task").post(authenricateToken, validate(schemas.createValidation), addSubTask);
router.route("/:id").get(authenricateToken, fetchTask);
router.route("/:id/:commentId").delete(authenricateToken, deleteComment);

module.exports =  router;