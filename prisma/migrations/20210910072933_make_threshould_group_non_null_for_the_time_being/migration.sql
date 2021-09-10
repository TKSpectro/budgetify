/*
  Warnings:

  - Made the column `groupId` on table `Threshold` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Threshold" ALTER COLUMN "groupId" SET NOT NULL;
