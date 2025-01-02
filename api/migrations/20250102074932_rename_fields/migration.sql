ALTER TABLE `blog_post` RENAME COLUMN `read_time` TO `readTime`;
ALTER TABLE `blog_post` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `blog_post` RENAME COLUMN `updated_at` TO `updatedAt`;

ALTER TABLE `cart` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `cart` RENAME COLUMN `updated_at` TO `updatedAt`;

ALTER TABLE `cart_product` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `cart_product` RENAME COLUMN `updated_at` TO `updatedAt`;

ALTER TABLE `category` RENAME COLUMN `long_title` TO `longTitle`;

ALTER TABLE `delivery` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `delivery` RENAME COLUMN `delivered_at` TO `deliveredAt`;

ALTER TABLE `file` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `file` RENAME COLUMN `updated_at` TO `updatedAt`;

ALTER TABLE `option` RENAME COLUMN `in_filter` TO `inFilter`;

ALTER TABLE `order` RENAME COLUMN `created_at` TO `createdAt`;

ALTER TABLE `payment` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `payment` RENAME COLUMN `paid_at` TO `paidAt`;

ALTER TABLE `pickup_point` RENAME COLUMN `district_name` TO `districtName`;
ALTER TABLE `pickup_point` RENAME COLUMN `subject_name` TO `subjectName`;
ALTER TABLE `pickup_point` RENAME COLUMN `city_type` TO `cityType`;
ALTER TABLE `pickup_point` RENAME COLUMN `city_name` TO `cityName`;
ALTER TABLE `pickup_point` RENAME COLUMN `full_address` TO `fullAddress`;
ALTER TABLE `pickup_point` RENAME COLUMN `short_address` TO `shortAddress`;
ALTER TABLE `pickup_point` RENAME COLUMN `work_time` TO `workTime`;
ALTER TABLE `pickup_point` RENAME COLUMN `is_reception` TO `isReception`;
ALTER TABLE `pickup_point` RENAME COLUMN `is_dressing_room` TO `isDressingRoom`;
ALTER TABLE `pickup_point` RENAME COLUMN `allowed_cod` TO `allowedCod`;
ALTER TABLE `pickup_point` RENAME COLUMN `have_cash` TO `haveCash`;
ALTER TABLE `pickup_point` RENAME COLUMN `have_cashless` TO `haveCashless`;

ALTER TABLE `product` RENAME COLUMN `long_title` TO `longTitle`;
ALTER TABLE `product` RENAME COLUMN `price_decrease` TO `priceDecrease`;
ALTER TABLE `product` RENAME COLUMN `in_stock` TO `inStock`;
