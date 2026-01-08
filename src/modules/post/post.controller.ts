import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

// =================== create a post ====================

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "post creation failed ", message: error?.message });
  }
};

// =================== get all posts ====================
const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    //  query with multiple keyword as tags
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    //  isFeatured by searching
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    // status
    const status = req.query.status as PostStatus | undefined;
    // authorId
    const authorId = req.query.authorId as string | undefined;

    //* pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    //------------------------- result------------------
    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post fail to fetch",
      details: error,
    });
  }
};

// =================== get post by id ====================
const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
   
    if (!postId) {
      throw new Error("Post id is required");
    }

    const result = await postService.getPostById(postId);
    res.status(200).json(result); 
    // send the result
  } catch (error) {
    res.status(400).json({
      error: "Post fail to fetch",
      details: error,
    });
  }
}
export const postController = { getAllPost, createPost, getPostById };
