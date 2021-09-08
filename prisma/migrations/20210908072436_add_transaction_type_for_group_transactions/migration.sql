/*
  Warnings:

  - Added the required column `type` to the `GroupTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TOP_UP', 'TAKE_OUT', 'BUY');

-- AlterTable
ALTER TABLE "GroupTransaction" ADD COLUMN     "type" "TransactionType" NOT NULL;
