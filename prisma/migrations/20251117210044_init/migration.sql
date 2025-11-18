-- CreateTable
CREATE TABLE `Round` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `nonce` VARCHAR(191) NOT NULL,
    `commitHex` VARCHAR(191) NOT NULL,
    `serverSeed` VARCHAR(191) NULL,
    `clientSeed` VARCHAR(191) NULL,
    `combinedSeed` VARCHAR(191) NOT NULL,
    `pegMapHash` VARCHAR(191) NOT NULL,
    `rows` INTEGER NOT NULL DEFAULT 12,
    `dropColumn` INTEGER NOT NULL,
    `binIndex` INTEGER NOT NULL,
    `payoutMultiplier` DOUBLE NOT NULL,
    `betCents` INTEGER NOT NULL,
    `pathJson` JSON NOT NULL,
    `revealedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
