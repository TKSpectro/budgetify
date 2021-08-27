/*
  Warnings:

  - You are about to drop the column `link` on the `Invite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.
  - The required column `token` was added to the `Invite` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "link",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invite.token_unique" ON "Invite"("token");
