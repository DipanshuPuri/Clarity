/*
  Warnings:

  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "priority" TEXT DEFAULT 'Medium',
ADD COLUMN     "status" TEXT DEFAULT 'Ongoing',
ADD COLUMN     "team" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
