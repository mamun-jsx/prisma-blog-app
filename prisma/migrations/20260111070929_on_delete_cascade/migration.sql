-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_patentId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_patentId_fkey" FOREIGN KEY ("patentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
