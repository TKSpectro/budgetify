/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_ownerId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "ownerId";

-- CreateTable
CREATE TABLE "_GroupOwners" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupOwners_AB_unique" ON "_GroupOwners"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupOwners_B_index" ON "_GroupOwners"("B");

-- AddForeignKey
ALTER TABLE "_GroupOwners" ADD FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupOwners" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
