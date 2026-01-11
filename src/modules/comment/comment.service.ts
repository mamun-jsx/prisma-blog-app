import { CommentStatus } from "../../../generated/prisma/enums";
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
// ===============| Get comment by author |================
const getCommentByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
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
// ==============| delete a comment |=================
const deleteCommentById = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      // visible only id so the all data is not fetch into frontend
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("your provided input is invalid");
  }
  // delete the comment data which is taken from commentData
  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};
// =================== | Update a comment by id |=========
const updateCommentById = async (
  commentId: string,
  data: {
    content?: string;
    status?: CommentStatus;
  },
  authorId: string
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("your comment is not updated ");
  }
  return await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    // data assign here..
    data
  });
};
// =========================| export all func |=======================
export const commentService = {
  createComment,
  updateCommentById,
  getCommentByAuthor,
  getCommentBtId,
  deleteCommentById,
};
