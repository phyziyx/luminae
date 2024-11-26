-- AlterTable
ALTER TABLE `Package` ADD COLUMN `stripeLinkAnnually` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `stripeLinkMonthly` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX `Agency_id_idx` ON `Agency`(`id`);

-- CreateIndex
CREATE INDEX `Package_id_idx` ON `Package`(`id`);

-- CreateIndex
CREATE INDEX `Subscription_id_idx` ON `Subscription`(`id`);
