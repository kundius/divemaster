import { Migration } from '@mikro-orm/migrations';

export class Migration20240917140546 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `brand` (`id` int unsigned not null auto_increment primary key, `remote_id` varchar(255) null, `title` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `city` (`id` varchar(36) not null, `type` varchar(255) not null, `name` varchar(255) not null, `subject` varchar(255) not null, `district` varchar(255) not null, `lat` float not null, `lon` float not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `file` (`id` int unsigned not null auto_increment primary key, `file` varchar(255) not null, `path` varchar(255) not null, `hash` varchar(255) not null, `type` varchar(255) not null, `size` int not null, `metadata` json null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `category` (`id` int unsigned not null auto_increment primary key, `remote_id` varchar(255) null, `title` varchar(255) not null, `long_title` varchar(255) null, `alias` varchar(255) not null, `rank` int not null default 0, `description` text null, `active` tinyint(1) not null default true, `image_id` int unsigned null, `parent_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `category` add unique `category_alias_unique`(`alias`);');
    this.addSql('alter table `category` add index `category_image_id_index`(`image_id`);');
    this.addSql('alter table `category` add index `category_parent_id_index`(`parent_id`);');

    this.addSql('create table `option` (`id` int unsigned not null auto_increment primary key, `key` varchar(255) not null, `caption` varchar(255) not null, `type` enum(\'combo-boolean\', \'combo-colors\', \'combo-options\', \'numberfield\', \'textfield\') not null, `in_filter` tinyint(1) not null default false, `rank` int not null default 0) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `option` add unique `option_key_unique`(`key`);');

    this.addSql('create table `category_options` (`category_id` int unsigned not null, `option_id` int unsigned not null, primary key (`category_id`, `option_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `category_options` add index `category_options_category_id_index`(`category_id`);');
    this.addSql('alter table `category_options` add index `category_options_option_id_index`(`option_id`);');

    this.addSql('create table `pickup_point` (`id` varchar(36) not null, `name` varchar(255) not null, `district_name` varchar(255) not null, `subject_name` varchar(255) not null, `city_type` varchar(255) not null, `city_name` varchar(255) not null, `full_address` varchar(255) not null, `short_address` varchar(255) not null, `phone` varchar(255) null, `email` varchar(255) null, `work_time` varchar(255) not null, `lat` float not null, `lon` float not null, `note` varchar(255) null, `is_reception` tinyint(1) not null default false, `is_dressing_room` tinyint(1) not null default false, `allowed_cod` tinyint(1) not null default false, `have_cash` tinyint(1) not null default false, `have_cashless` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `product` (`id` int unsigned not null auto_increment primary key, `remote_id` varchar(255) null, `title` varchar(255) not null, `long_title` varchar(255) null, `alias` varchar(255) not null, `sku` varchar(255) null, `rank` int not null default 0, `price_decrease` int null, `description` text null, `specifications` text null, `exploitation` text null, `active` tinyint(1) not null default true, `in_stock` tinyint(1) not null default true, `recent` tinyint(1) not null default false, `favorite` tinyint(1) not null default false, `brand_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product` add unique `product_alias_unique`(`alias`);');
    this.addSql('alter table `product` add index `product_brand_id_index`(`brand_id`);');

    this.addSql('create table `option_value` (`id` int unsigned not null auto_increment primary key, `content` varchar(255) not null, `option_id` int unsigned not null, `product_id` int unsigned not null, `rank` int not null default 0, `properties` json null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `option_value` add index `option_value_option_id_index`(`option_id`);');
    this.addSql('alter table `option_value` add index `option_value_product_id_index`(`product_id`);');

    this.addSql('create table `offer` (`id` int unsigned not null auto_increment primary key, `remote_id` varchar(255) null, `title` varchar(255) null, `price` int not null, `rank` int not null default 0, `product_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `offer` add index `offer_product_id_index`(`product_id`);');

    this.addSql('create table `offer_option_values` (`offer_id` int unsigned not null, `option_value_id` int unsigned not null, primary key (`offer_id`, `option_value_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `offer_option_values` add index `offer_option_values_offer_id_index`(`offer_id`);');
    this.addSql('alter table `offer_option_values` add index `offer_option_values_option_value_id_index`(`option_value_id`);');

    this.addSql('create table `category_products` (`category_id` int unsigned not null, `product_id` int unsigned not null, primary key (`category_id`, `product_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `category_products` add index `category_products_category_id_index`(`category_id`);');
    this.addSql('alter table `category_products` add index `category_products_product_id_index`(`product_id`);');

    this.addSql('create table `brand_products` (`brand_id` int unsigned not null, `product_id` int unsigned not null, primary key (`brand_id`, `product_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `brand_products` add index `brand_products_brand_id_index`(`brand_id`);');
    this.addSql('alter table `brand_products` add index `brand_products_product_id_index`(`product_id`);');

    this.addSql('create table `product_image` (`file_id` int unsigned not null, `product_id` int unsigned not null, `rank` int not null default 0, `active` tinyint(1) not null default true, primary key (`file_id`, `product_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product_image` add index `product_image_file_id_index`(`file_id`);');
    this.addSql('alter table `product_image` add index `product_image_product_id_index`(`product_id`);');

    this.addSql('create table `role` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `scope` json null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `role` add unique `role_title_unique`(`title`);');

    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `email` varchar(255) not null, `name` varchar(255) not null, `password` varchar(255) not null, `active` tinyint(1) not null default true, `discount` int not null default 0, `role_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');
    this.addSql('alter table `user` add index `user_role_id_index`(`role_id`);');

    this.addSql('create table `order` (`id` int unsigned not null auto_increment primary key, `hash` varchar(255) not null, `cost` int unsigned not null, `composition` json null, `user_id` int unsigned null, `created_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order` add unique `order_hash_unique`(`hash`);');
    this.addSql('alter table `order` add index `order_user_id_index`(`user_id`);');

    this.addSql('create table `payment` (`id` int unsigned not null auto_increment primary key, `service` enum(\'Yookassa\', \'UponCash\') not null, `paid` tinyint null, `link` varchar(255) null default null, `remote_id` varchar(255) null default null, `order_id` int unsigned not null, `created_at` datetime not null, `paid_at` datetime null default null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `payment` add unique `payment_order_id_unique`(`order_id`);');

    this.addSql('create table `order_product` (`id` int unsigned not null auto_increment primary key, `order_id` int unsigned not null, `product_id` int unsigned null, `quantity` int unsigned not null, `price` int unsigned not null, `title` varchar(255) not null, `options` json null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order_product` add index `order_product_order_id_index`(`order_id`);');
    this.addSql('alter table `order_product` add index `order_product_product_id_index`(`product_id`);');

    this.addSql('create table `delivery` (`id` int unsigned not null auto_increment primary key, `service` enum(\'Pickup\', \'Shipping\') not null, `delivered` tinyint null, `address` varchar(255) not null, `recipient` json null, `order_id` int unsigned not null, `created_at` datetime not null, `delivered_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `delivery` add unique `delivery_order_id_unique`(`order_id`);');

    this.addSql('create table `cart` (`id` varchar(36) not null, `user_id` int unsigned null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `cart` add unique `cart_user_id_unique`(`user_id`);');

    this.addSql('create table `cart_product` (`id` varchar(36) not null, `cart_id` varchar(36) not null, `product_id` int unsigned not null, `quantity` int unsigned not null default 1, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `cart_product` add index `cart_product_cart_id_index`(`cart_id`);');
    this.addSql('alter table `cart_product` add index `cart_product_product_id_index`(`product_id`);');

    this.addSql('create table `cart_product_option_values` (`cart_product_id` varchar(36) not null, `option_value_id` int unsigned not null, primary key (`cart_product_id`, `option_value_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `cart_product_option_values` add index `cart_product_option_values_cart_product_id_index`(`cart_product_id`);');
    this.addSql('alter table `cart_product_option_values` add index `cart_product_option_values_option_value_id_index`(`option_value_id`);');

    this.addSql('alter table `category` add constraint `category_image_id_foreign` foreign key (`image_id`) references `file` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `category` add constraint `category_parent_id_foreign` foreign key (`parent_id`) references `category` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `category_options` add constraint `category_options_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `category_options` add constraint `category_options_option_id_foreign` foreign key (`option_id`) references `option` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `product` add constraint `product_brand_id_foreign` foreign key (`brand_id`) references `brand` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `option_value` add constraint `option_value_option_id_foreign` foreign key (`option_id`) references `option` (`id`) on update cascade;');
    this.addSql('alter table `option_value` add constraint `option_value_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('alter table `offer` add constraint `offer_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('alter table `offer_option_values` add constraint `offer_option_values_offer_id_foreign` foreign key (`offer_id`) references `offer` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `offer_option_values` add constraint `offer_option_values_option_value_id_foreign` foreign key (`option_value_id`) references `option_value` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `category_products` add constraint `category_products_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `category_products` add constraint `category_products_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `brand_products` add constraint `brand_products_brand_id_foreign` foreign key (`brand_id`) references `brand` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `brand_products` add constraint `brand_products_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `product_image` add constraint `product_image_file_id_foreign` foreign key (`file_id`) references `file` (`id`) on update cascade;');
    this.addSql('alter table `product_image` add constraint `product_image_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('alter table `user` add constraint `user_role_id_foreign` foreign key (`role_id`) references `role` (`id`) on update cascade;');

    this.addSql('alter table `order` add constraint `order_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `payment` add constraint `payment_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade;');

    this.addSql('alter table `order_product` add constraint `order_product_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `order_product` add constraint `order_product_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `delivery` add constraint `delivery_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade;');

    this.addSql('alter table `cart` add constraint `cart_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `cart_product` add constraint `cart_product_cart_id_foreign` foreign key (`cart_id`) references `cart` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product` add constraint `cart_product_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `cart_product_option_values` add constraint `cart_product_option_values_cart_product_id_foreign` foreign key (`cart_product_id`) references `cart_product` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product_option_values` add constraint `cart_product_option_values_option_value_id_foreign` foreign key (`option_value_id`) references `option_value` (`id`) on update cascade on delete cascade;');
  }

}
