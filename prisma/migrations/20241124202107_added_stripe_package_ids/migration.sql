/*
  Warnings:

  - You are about to drop the column `discountRate` on the `Package` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Package` DROP COLUMN `discountRate`,
    ADD COLUMN `stripePriceIdAnnually` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `stripePriceIdMonthly` VARCHAR(191) NOT NULL DEFAULT '';
