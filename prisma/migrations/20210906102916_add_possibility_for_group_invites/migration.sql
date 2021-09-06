-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "groupId" TEXT,
ALTER COLUMN "householdId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invite" ADD FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
