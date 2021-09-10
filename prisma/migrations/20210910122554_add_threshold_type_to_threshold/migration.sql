/*
  Warnings:

  - Added the required column `type` to the `Threshold` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ThresholdType" AS ENUM ('GOAL', 'LIMIT', 'WARNING');

-- AlterTable
ALTER TABLE "Threshold" ADD COLUMN     "type" "ThresholdType" NOT NULL;
