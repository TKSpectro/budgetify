/*
  Warnings:

  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Company";
-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION;
