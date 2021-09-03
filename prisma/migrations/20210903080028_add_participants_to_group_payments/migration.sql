-- CreateTable
CREATE TABLE "_Participants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Participants_AB_unique" ON "_Participants"("A", "B");

-- CreateIndex
CREATE INDEX "_Participants_B_index" ON "_Participants"("B");

-- AddForeignKey
ALTER TABLE "_Participants" ADD FOREIGN KEY ("A") REFERENCES "GroupPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Participants" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
