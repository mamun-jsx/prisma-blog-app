import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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
const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            // use has because tags is a array
            has: search as string,
          },
        },
      ],
    });
  }
  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }
  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
    });
  }
  // status
  if (status) {
    andConditions.push({ status });
  }
  const allPost = await prisma.post.findMany({
    // search
    where: {
      //  OR is a condition to take search input with title or content where input matches..

      AND: andConditions,
    },
  });
  return allPost;
};
export const postService = { createPost, getAllPost };
