-- CreateTable
CREATE TABLE `VocabEntry` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `pos` VARCHAR(191) NULL,
    `translation` TEXT NULL,
    `aiAnalysis` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateGroup` VARCHAR(191) NOT NULL,

    INDEX `VocabEntry_dateGroup_idx`(`dateGroup`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
