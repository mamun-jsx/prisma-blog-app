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
export const commentController = {
  createComment,
};
