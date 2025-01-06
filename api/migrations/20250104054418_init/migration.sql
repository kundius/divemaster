-- CreateTable
CREATE TABLE `blog_post` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `longTitle` VARCHAR(255) NULL,
    `alias` VARCHAR(255) NOT NULL,
    `content` TEXT NULL,
    `readTime` VARCHAR(255) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `imageId` INTEGER UNSIGNED NULL,
    `status` ENUM('published', 'draft', 'archived') NOT NULL DEFAULT 'draft',

    UNIQUE INDEX `blog_post_alias_key`(`alias`),
    INDEX `blog_post_imageId_idx`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_tag` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `alias` VARCHAR(255) NOT NULL,
    `metadata` JSON NULL,

    UNIQUE INDEX `blog_tag_alias_key`(`alias`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_tag_posts` (
    `blogTagId` INTEGER UNSIGNED NOT NULL,
    `blogPostId` INTEGER UNSIGNED NOT NULL,

    INDEX `blog_tag_posts_blogPostId_idx`(`blogPostId`),
    INDEX `blog_tag_posts_blogTagId_idx`(`blogTagId`),
    PRIMARY KEY (`blogTagId`, `blogPostId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `remoteId` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `id` VARCHAR(36) NOT NULL,
    `userId` INTEGER UNSIGNED NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cart_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_product` (
    `id` VARCHAR(36) NOT NULL,
    `cartId` VARCHAR(36) NOT NULL,
    `productId` INTEGER UNSIGNED NOT NULL,
    `quantity` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `cart_product_cartId_idx`(`cartId`),
    INDEX `cart_product_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_product_option_values` (
    `cartProductId` VARCHAR(36) NOT NULL,
    `optionValueId` INTEGER UNSIGNED NOT NULL,

    INDEX `cart_product_option_values_cartProductId_idx`(`cartProductId`),
    INDEX `cart_product_option_values_optionValueId_idx`(`optionValueId`),
    PRIMARY KEY (`cartProductId`, `optionValueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `remoteId` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `longTitle` VARCHAR(255) NULL,
    `alias` VARCHAR(255) NOT NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `imageId` INTEGER UNSIGNED NULL,
    `parentId` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `category_alias_key`(`alias`),
    INDEX `category_imageId_idx`(`imageId`),
    INDEX `category_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_options` (
    `categoryId` INTEGER UNSIGNED NOT NULL,
    `optionId` INTEGER UNSIGNED NOT NULL,

    INDEX `category_options_categoryId_idx`(`categoryId`),
    INDEX `category_options_optionId_idx`(`optionId`),
    PRIMARY KEY (`categoryId`, `optionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_products` (
    `categoryId` INTEGER UNSIGNED NOT NULL,
    `productId` INTEGER UNSIGNED NOT NULL,

    INDEX `category_products_categoryId_idx`(`categoryId`),
    INDEX `category_products_productId_idx`(`productId`),
    PRIMARY KEY (`categoryId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` VARCHAR(36) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `district` VARCHAR(255) NOT NULL,
    `lat` FLOAT NOT NULL,
    `lon` FLOAT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `service` ENUM('Pickup', 'Shipping') NOT NULL,
    `delivered` TINYINT NULL,
    `address` VARCHAR(255) NOT NULL,
    `recipient` JSON NULL,
    `orderId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deliveredAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `delivery_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `file` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `hash` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `size` INTEGER NOT NULL,
    `metadata` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `remoteId` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `price` INTEGER NOT NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `productId` INTEGER UNSIGNED NOT NULL,

    INDEX `offer_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_option_values` (
    `offerId` INTEGER UNSIGNED NOT NULL,
    `optionValueId` INTEGER UNSIGNED NOT NULL,

    INDEX `offer_option_values_offerId_idx`(`offerId`),
    INDEX `offer_option_values_optionValueId_idx`(`optionValueId`),
    PRIMARY KEY (`offerId`, `optionValueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `option` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL,
    `caption` VARCHAR(255) NOT NULL,
    `type` ENUM('combo-boolean', 'combo-colors', 'combo-options', 'numberfield', 'textfield') NOT NULL,
    `inFilter` BOOLEAN NOT NULL DEFAULT false,
    `rank` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `option_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `option_value` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(255) NOT NULL,
    `optionId` INTEGER UNSIGNED NOT NULL,
    `productId` INTEGER UNSIGNED NOT NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `properties` JSON NULL,

    INDEX `option_value_optionId_idx`(`optionId`),
    INDEX `option_value_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(255) NOT NULL,
    `cost` INTEGER UNSIGNED NOT NULL,
    `composition` JSON NULL,
    `userId` INTEGER UNSIGNED NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `order_hash_key`(`hash`),
    INDEX `order_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_product` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER UNSIGNED NOT NULL,
    `productId` INTEGER UNSIGNED NULL,
    `quantity` INTEGER UNSIGNED NOT NULL,
    `price` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `options` JSON NULL,

    INDEX `order_product_orderId_idx`(`orderId`),
    INDEX `order_product_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `service` ENUM('Yookassa', 'UponCash') NOT NULL,
    `paid` TINYINT NULL,
    `link` VARCHAR(255) NULL,
    `remoteId` VARCHAR(255) NULL,
    `orderId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paidAt` DATETIME(0) NULL,

    UNIQUE INDEX `payment_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pickup_point` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `districtName` VARCHAR(255) NOT NULL,
    `subjectName` VARCHAR(255) NOT NULL,
    `cityType` VARCHAR(255) NOT NULL,
    `cityName` VARCHAR(255) NOT NULL,
    `fullAddress` VARCHAR(255) NOT NULL,
    `shortAddress` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `workTime` VARCHAR(255) NOT NULL,
    `lat` FLOAT NOT NULL,
    `lon` FLOAT NOT NULL,
    `note` VARCHAR(255) NULL,
    `isReception` BOOLEAN NOT NULL DEFAULT false,
    `isDressingRoom` BOOLEAN NOT NULL DEFAULT false,
    `allowedCod` BOOLEAN NOT NULL DEFAULT false,
    `haveCash` BOOLEAN NOT NULL DEFAULT false,
    `haveCashless` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('cdek', 'store') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `remoteId` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `longTitle` VARCHAR(255) NULL,
    `alias` VARCHAR(255) NOT NULL,
    `sku` VARCHAR(255) NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `priceDecrease` INTEGER NULL,
    `description` TEXT NULL,
    `specifications` TEXT NULL,
    `exploitation` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `inStock` BOOLEAN NOT NULL DEFAULT true,
    `recent` BOOLEAN NOT NULL DEFAULT false,
    `favorite` BOOLEAN NOT NULL DEFAULT false,
    `brandId` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `product_alias_key`(`alias`),
    INDEX `product_brandId_idx`(`brandId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_image` (
    `fileId` INTEGER UNSIGNED NOT NULL,
    `productId` INTEGER UNSIGNED NOT NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `product_image_fileId_idx`(`fileId`),
    INDEX `product_image_productId_idx`(`productId`),
    PRIMARY KEY (`fileId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `scope` JSON NULL,

    UNIQUE INDEX `role_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `roleId` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_post` ADD CONSTRAINT `blog_post_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_tag_posts` ADD CONSTRAINT `blog_tag_posts_blogPostId_fkey` FOREIGN KEY (`blogPostId`) REFERENCES `blog_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_tag_posts` ADD CONSTRAINT `blog_tag_posts_blogTagId_fkey` FOREIGN KEY (`blogTagId`) REFERENCES `blog_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product` ADD CONSTRAINT `cart_product_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product` ADD CONSTRAINT `cart_product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product_option_values` ADD CONSTRAINT `cart_product_option_values_cartProductId_fkey` FOREIGN KEY (`cartProductId`) REFERENCES `cart_product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product_option_values` ADD CONSTRAINT `cart_product_option_values_optionValueId_fkey` FOREIGN KEY (`optionValueId`) REFERENCES `option_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_options` ADD CONSTRAINT `category_options_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_options` ADD CONSTRAINT `category_options_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_products` ADD CONSTRAINT `category_products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_products` ADD CONSTRAINT `category_products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer` ADD CONSTRAINT `offer_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer_option_values` ADD CONSTRAINT `offer_option_values_offerId_fkey` FOREIGN KEY (`offerId`) REFERENCES `offer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer_option_values` ADD CONSTRAINT `offer_option_values_optionValueId_fkey` FOREIGN KEY (`optionValueId`) REFERENCES `option_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `option_value` ADD CONSTRAINT `option_value_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `option_value` ADD CONSTRAINT `option_value_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_product` ADD CONSTRAINT `order_product_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_product` ADD CONSTRAINT `order_product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_image` ADD CONSTRAINT `product_image_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `file`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_image` ADD CONSTRAINT `product_image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
