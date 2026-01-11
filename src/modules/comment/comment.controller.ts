import { Request, Response } from "express";
import { commentService } from "./comment.service";
// =================== create a comment ============
const createComment = async (req: Request, res: Response) => {
  const user = req.user;
  req.body.authorId = user?.id;

  try {
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "comment failed" });
  }
};
// =================== get comment by id ============

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.getCommentBtId(commentId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "comment is not found with this id.. ",
      details: error,
    });
  }
};
// =================== get comment by author ============
const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentByAuthor(authorId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "comment is not found with this id.. ",
      details: error,
    });
  }
};
// =================== delete comment by id ============
const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.getCommentByAuthor(commentId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "delete comment by id failed",
      details: error,
    });
  }
};
export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteCommentById, 
};
