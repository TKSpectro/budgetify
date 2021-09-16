/*
  Warnings:

  - The values [LIMIT,WARNING] on the enum `ThresholdType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `trigger` on the `Threshold` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ThresholdType_new" AS ENUM ('MIN', 'MAX', 'GOAL');
ALTER TABLE "Threshold" ALTER COLUMN "type" TYPE "ThresholdType_new" USING ("type"::text::"ThresholdType_new");
ALTER TYPE "ThresholdType" RENAME TO "ThresholdType_old";
ALTER TYPE "ThresholdType_new" RENAME TO "ThresholdType";
DROP TYPE "ThresholdType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "GroupTransaction" DROP CONSTRAINT "GroupTransaction_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupTransaction" DROP CONSTRAINT "GroupTransaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Household" DROP CONSTRAINT "Household_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_householdId_fkey";

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_householdId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringPayment" DROP CONSTRAINT "RecurringPayment_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringPayment" DROP CONSTRAINT "RecurringPayment_householdId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringPayment" DROP CONSTRAINT "RecurringPayment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Threshold" DROP CONSTRAINT "Threshold_groupId_fkey";

-- AlterTable
ALTER TABLE "Threshold" DROP COLUMN "trigger";

-- DropEnum
DROP TYPE "ThresholdTrigger";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringPayment" ADD CONSTRAINT "RecurringPayment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringPayment" ADD CONSTRAINT "RecurringPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringPayment" ADD CONSTRAINT "RecurringPayment_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Household" ADD CONSTRAINT "Household_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTransaction" ADD CONSTRAINT "GroupTransaction_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTransaction" ADD CONSTRAINT "GroupTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Threshold" ADD CONSTRAINT "Threshold_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Category.name_unique" RENAME TO "Category_name_key";

-- RenameIndex
ALTER INDEX "Invite.token_unique" RENAME TO "Invite_token_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
