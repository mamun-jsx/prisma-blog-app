import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
 await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });
  if (payload.postId) {
  await prisma.comment.findFirstOrThrow({
      where: {
        id: payload.parentId as string,
      },
    });
  }
  return await prisma.comment.create({
    data: payload,
  });
};
export const commentService = {
  createComment,
};

