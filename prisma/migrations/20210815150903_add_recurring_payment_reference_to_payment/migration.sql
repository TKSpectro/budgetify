-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "recurringPaymentId" TEXT;

-- AddForeignKey
ALTER TABLE "Payment" ADD FOREIGN KEY ("recurringPaymentId") REFERENCES "RecurringPayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
