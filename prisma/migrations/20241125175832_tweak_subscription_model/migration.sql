/*
  Warnings:

  - Made the column `agencyId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_agencyId_fkey`;

-- AlterTable
ALTER TABLE `Agency` ADD COLUMN `stripeCustomerId` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Subscription` MODIFY `agencyId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
