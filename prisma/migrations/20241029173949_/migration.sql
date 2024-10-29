/*
  Warnings:

  - Added the required column `isAcknowledged` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trigerredAt` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alarm" ADD COLUMN     "isAcknowledged" BOOLEAN NOT NULL,
ADD COLUMN     "trigerredAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "AlarmItemEntity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "alarmId" TEXT NOT NULL,

    CONSTRAINT "AlarmItemEntity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlarmItemEntity" ADD CONSTRAINT "AlarmItemEntity_alarmId_fkey" FOREIGN KEY ("alarmId") REFERENCES "Alarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
