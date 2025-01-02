-- CreateTable
CREATE TABLE `blog_post` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `long_title` VARCHAR(255) NULL,
    `alias` VARCHAR(255) NOT NULL,
    `content` TEXT NULL,
    `read_time` VARCHAR(255) NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `image_id` INTEGER UNSIGNED NULL,
    `status` ENUM('published', 'draft', 'archived') NOT NULL DEFAULT 'draft',

    UNIQUE INDEX `blog_post_alias_unique`(`alias`),
    INDEX `blog_post_image_id_index`(`image_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_tag` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `alias` VARCHAR(255) NOT NULL,
    `metadata` JSON NULL,

    UNIQUE INDEX `blog_tag_alias_unique`(`alias`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_tag_posts` (
    `blog_tag_id` INTEGER UNSIGNED NOT NULL,
    `blog_post_id` INTEGER UNSIGNED NOT NULL,

    INDEX `blog_tag_posts_blog_post_id_index`(`blog_post_id`),
    INDEX `blog_tag_posts_blog_tag_id_index`(`blog_tag_id`),
    PRIMARY KEY (`blog_tag_id`, `blog_post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `remote_id` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cart_user_id_unique`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_product` (
    `id` VARCHAR(36) NOT NULL,
    `cart_id` VARCHAR(36) NOT NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `quantity` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `cart_product_cart_id_index`(`cart_id`),
    INDEX `cart_product_product_id_index`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_product_option_values` (
    `cart_product_id` VARCHAR(36) NOT NULL,
    `option_value_id` INTEGER UNSIGNED NOT NULL,

    INDEX `cart_product_option_values_cart_product_id_index`(`cart_product_id`),
    INDEX `cart_product_option_values_option_value_id_index`(`option_value_id`),
    PRIMARY KEY (`cart_product_id`, `option_value_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `remote_id` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `long_title` VARCHAR(255) NULL,
    `alias` VARCHAR(255) NOT NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `image_id` INTEGER UNSIGNED NULL,
    `parent_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `category_alias_unique`(`alias`),
    INDEX `category_image_id_index`(`image_id`),
    INDEX `category_parent_id_index`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_options` (
    `category_id` INTEGER UNSIGNED NOT NULL,
    `option_id` INTEGER UNSIGNED NOT NULL,

    INDEX `category_options_category_id_index`(`category_id`),
    INDEX `category_options_option_id_index`(`option_id`),
    PRIMARY KEY (`category_id`, `option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_products` (
    `category_id` INTEGER UNSIGNED NOT NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,

    INDEX `category_products_category_id_index`(`category_id`),
    INDEX `category_products_product_id_index`(`product_id`),
    PRIMARY KEY (`category_id`, `product_id`)
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
    `order_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `delivered_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `delivery_order_id_unique`(`order_id`),
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
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `remote_id` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `price` INTEGER NOT NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `product_id` INTEGER UNSIGNED NOT NULL,

    INDEX `offer_product_id_index`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_option_values` (
    `offer_id` INTEGER UNSIGNED NOT NULL,
    `option_value_id` INTEGER UNSIGNED NOT NULL,

    INDEX `offer_option_values_offer_id_index`(`offer_id`),
    INDEX `offer_option_values_option_value_id_index`(`option_value_id`),
    PRIMARY KEY (`offer_id`, `option_value_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `option` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL,
    `caption` VARCHAR(255) NOT NULL,
    `type` ENUM('combo-boolean', 'combo-colors', 'combo-options', 'numberfield', 'textfield') NOT NULL,
    `in_filter` BOOLEAN NOT NULL DEFAULT false,
    `rank` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `option_key_unique`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `option_value` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(255) NOT NULL,
    `option_id` INTEGER UNSIGNED NOT NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `properties` JSON NULL,

    INDEX `option_value_option_id_index`(`option_id`),
    INDEX `option_value_product_id_index`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(255) NOT NULL,
    `cost` INTEGER UNSIGNED NOT NULL,
    `composition` JSON NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `order_hash_unique`(`hash`),
    INDEX `order_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_product` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER UNSIGNED NOT NULL,
    `product_id` INTEGER UNSIGNED NULL,
    `quantity` INTEGER UNSIGNED NOT NULL,
    `price` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `options` JSON NULL,

    INDEX `order_product_order_id_index`(`order_id`),
    INDEX `order_product_product_id_index`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `service` ENUM('Yookassa', 'UponCash') NOT NULL,
    `paid` TINYINT NULL,
    `link` VARCHAR(255) NULL,
    `remote_id` VARCHAR(255) NULL,
    `order_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paid_at` DATETIME(0) NULL,

    UNIQUE INDEX `payment_order_id_unique`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pickup_point` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `district_name` VARCHAR(255) NOT NULL,
    `subject_name` VARCHAR(255) NOT NULL,
    `city_type` VARCHAR(255) NOT NULL,
    `city_name` VARCHAR(255) NOT NULL,
    `full_address` VARCHAR(255) NOT NULL,
    `short_address` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `work_time` VARCHAR(255) NOT NULL,
    `lat` FLOAT NOT NULL,
    `lon` FLOAT NOT NULL,
    `note` VARCHAR(255) NULL,
    `is_reception` BOOLEAN NOT NULL DEFAULT false,
    `is_dressing_room` BOOLEAN NOT NULL DEFAULT false,
    `allowed_cod` BOOLEAN NOT NULL DEFAULT false,
    `have_cash` BOOLEAN NOT NULL DEFAULT false,
    `have_cashless` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('cdek', 'store') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `remote_id` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `long_title` VARCHAR(255) NULL,
    `alias` VARCHAR(255) NOT NULL,
    `sku` VARCHAR(255) NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `price_decrease` INTEGER NULL,
    `description` TEXT NULL,
    `specifications` TEXT NULL,
    `exploitation` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `in_stock` BOOLEAN NOT NULL DEFAULT true,
    `recent` BOOLEAN NOT NULL DEFAULT false,
    `favorite` BOOLEAN NOT NULL DEFAULT false,
    `brand_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `product_alias_unique`(`alias`),
    INDEX `product_brand_id_index`(`brand_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_image` (
    `file_id` INTEGER UNSIGNED NOT NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `product_image_file_id_index`(`file_id`),
    INDEX `product_image_product_id_index`(`product_id`),
    PRIMARY KEY (`file_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `scope` JSON NULL,

    UNIQUE INDEX `role_title_unique`(`title`),
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
    `role_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `user_email_unique`(`email`),
    INDEX `user_role_id_index`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_post` ADD CONSTRAINT `blog_post_image_id_foreign` FOREIGN KEY (`image_id`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_tag_posts` ADD CONSTRAINT `blog_tag_posts_blog_post_id_foreign` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_tag_posts` ADD CONSTRAINT `blog_tag_posts_blog_tag_id_foreign` FOREIGN KEY (`blog_tag_id`) REFERENCES `blog_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product` ADD CONSTRAINT `cart_product_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product` ADD CONSTRAINT `cart_product_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product_option_values` ADD CONSTRAINT `cart_product_option_values_cart_product_id_foreign` FOREIGN KEY (`cart_product_id`) REFERENCES `cart_product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product_option_values` ADD CONSTRAINT `cart_product_option_values_option_value_id_foreign` FOREIGN KEY (`option_value_id`) REFERENCES `option_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_image_id_foreign` FOREIGN KEY (`image_id`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_options` ADD CONSTRAINT `category_options_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_options` ADD CONSTRAINT `category_options_option_id_foreign` FOREIGN KEY (`option_id`) REFERENCES `option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_products` ADD CONSTRAINT `category_products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_products` ADD CONSTRAINT `category_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer` ADD CONSTRAINT `offer_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer_option_values` ADD CONSTRAINT `offer_option_values_offer_id_foreign` FOREIGN KEY (`offer_id`) REFERENCES `offer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer_option_values` ADD CONSTRAINT `offer_option_values_option_value_id_foreign` FOREIGN KEY (`option_value_id`) REFERENCES `option_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `option_value` ADD CONSTRAINT `option_value_option_id_foreign` FOREIGN KEY (`option_id`) REFERENCES `option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `option_value` ADD CONSTRAINT `option_value_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_product` ADD CONSTRAINT `order_product_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_product` ADD CONSTRAINT `order_product_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_image` ADD CONSTRAINT `product_image_file_id_foreign` FOREIGN KEY (`file_id`) REFERENCES `file`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_image` ADD CONSTRAINT `product_image_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
