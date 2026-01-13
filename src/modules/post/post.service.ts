import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CommentStatus } from "../../../generated/prisma/enums";

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
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string | undefined;
  sortOrder: string | undefined;
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
  // author
  if (authorId) {
    andConditions.push({ authorId });
  }
  const allPost = await prisma.post.findMany({
    // search
    take: limit,
    skip,
    where: {
      //  OR is a condition to take search input with title or content where input matches..

      AND: andConditions,
    },
    // orderBy
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
    // comments count-- how many comment has into a post
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
  // pagination data show..
  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    allPost, // all data
    // meta_Data
    total,
    page,
    limit,
    // total page count
    totalPages: Math.ceil(total / limit),
  };
};

//?===================== Get post by id ==========

const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        views: { increment: 1 },
      },
    });
    // find by id and show
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            patentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: true,
          },
        },
      },
    });
    return postData;
  });
};
//?===================== Get My by id ==========
const getMyPostById = async (authorId: string) => {
  //  user must have to active status otherwise we will not show him/her data....
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });
  // show the data which was posted by user
  const result = await prisma.post.findMany({
    where: {
      id: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  // calculate how many post you have
  // const total = await prisma.post.count({
  //   where: {
  //     authorId,
  //   },
  // });
  // return { data: result, total };
  return result;
};
// ==============| update my own post |===========

const updateMyOwnPost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  // check author id is true or false
  if (!isAdmin && (postData.authorId !== authorId)) {
    throw new Error("Your are not owner of the post");
  }
  const result = await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });
  // return the result.......
  return result;
};

export const postService = {
  getMyPostById,
  createPost,
  getAllPost,
  getPostById,
  updateMyOwnPost,
};
