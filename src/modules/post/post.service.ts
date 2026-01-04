import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};
//?=====================fetch all data from database==========
const getAllPost = async (payload: { search: string | undefined }) => {
  const allPost = await prisma.post.findMany({
    where: {
      //  OR is a condition to take search input with title or content where input matches..
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            // use has because tags is a array
            has: payload.search as string,
          },
        },
      ],
    },
  });
  return allPost;
};
export const postService = { createPost, getAllPost };
