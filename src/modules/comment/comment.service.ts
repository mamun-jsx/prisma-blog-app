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
// =============== Get comment by id=============
const getCommentBtId = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id, //comment id
    },
    // attach the post(info) with the comment.....
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};
// =========================| export all func |=======================
export const commentService = {
  createComment,
  getCommentBtId,
};
