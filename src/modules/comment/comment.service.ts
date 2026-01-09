import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  return await prisma.comment.create({
    data: payload,
  });
};
export const commentService = {
  createComment,
};