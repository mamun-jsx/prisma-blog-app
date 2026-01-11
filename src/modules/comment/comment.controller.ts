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
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.deleteCommentById(
      commentId as string,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "delete comment by id failed",
      details: error,
    });
  }
};
// ========================| Update a comment by id ============
const updateCommentById = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.updateCommentById(
      commentId as string,
      req.body,
      user?.id as string
    );
    // send response to client_side
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Comment update failed!",
      details: error,
    });
  }
};
// ========================| Moderate comment  ============
const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.moderateComment(
      commentId as string,
      req.body
    );

    // send response to client_side
    res.status(200).json(result);
  } catch (error) {
    // instance of
    const errorMessage =
      error instanceof Error ? error?.message : "comment update is failed";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

/**
 *
 *
 *
 *
 *
 *
 * **/
// !=============================================================================
//! ======================| Exports all function |===============================
export const commentController = {
  createComment,
  updateCommentById,
  getCommentById,
  getCommentByAuthor,
  deleteCommentById,
  moderateComment,
};
