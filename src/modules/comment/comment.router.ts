import express, { Router } from "express";
import { commentController } from "./comment.controller";
import { auth, UserRole } from "../post/post.router";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);
// get comment by id
router.get("/:commentId", commentController.getCommentById);
// get comment by author
router.get("/author/:authorId", commentController.getCommentByAuthor);

export const commentRouter: Router = router;
