-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubId" INTEGER,
ALTER COLUMN "hashedPassword" DROP NOT NULL;
