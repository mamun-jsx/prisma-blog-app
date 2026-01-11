import { Request, Response } from "express";
import { commentService } from "./comment.service";

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
export const commentController = {
  createComment,
  getCommentById,
};
