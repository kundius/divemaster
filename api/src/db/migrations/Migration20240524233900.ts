import { Migration } from '@mikro-orm/migrations'

export class Migration20240524233900 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `category` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `alias` varchar(255) not null, `description` text null, `active` tinyint(1) not null default true, `parent_id` int unsigned null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql('alter table `category` add unique `category_alias_unique`(`alias`);')
    this.addSql('alter table `category` add index `category_parent_id_index`(`parent_id`);')

    this.addSql(
      'create table `file` (`id` int unsigned not null auto_increment primary key, `file` varchar(255) not null, `path` varchar(255) not null, `hash` varchar(255) not null, `type` varchar(255) not null, `size` int not null, `metadata` json null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;'
    )

    this.addSql(
      'create table `product` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `alias` varchar(255) not null, `sku` varchar(255) null, `price` int not null, `description` text null, `active` tinyint(1) not null default true) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql('alter table `product` add unique `product_alias_unique`(`alias`);')

    this.addSql(
      'create table `category_products` (`category_id` int unsigned not null, `product_id` int unsigned not null, primary key (`category_id`, `product_id`)) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `category_products` add index `category_products_category_id_index`(`category_id`);'
    )
    this.addSql(
      'alter table `category_products` add index `category_products_product_id_index`(`product_id`);'
    )

    this.addSql(
      'create table `product_image` (`file_id` int unsigned not null, `product_id` int unsigned not null, `rank` int not null default 0, `active` tinyint(1) not null default true, primary key (`file_id`, `product_id`)) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql('alter table `product_image` add index `product_image_file_id_index`(`file_id`);')
    this.addSql(
      'alter table `product_image` add index `product_image_product_id_index`(`product_id`);'
    )

    this.addSql(
      'create table `role` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `scope` json null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql('alter table `role` add unique `role_title_unique`(`title`);')

    this.addSql(
      'create table `user` (`id` int unsigned not null auto_increment primary key, `email` varchar(255) not null, `name` varchar(255) not null, `password` varchar(255) not null, `active` tinyint(1) not null default true, `role_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);')
    this.addSql('alter table `user` add index `user_role_id_index`(`role_id`);')

    this.addSql(
      'alter table `category` add constraint `category_parent_id_foreign` foreign key (`parent_id`) references `category` (`id`) on update cascade on delete set null;'
    )

    this.addSql(
      'alter table `category_products` add constraint `category_products_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table `category_products` add constraint `category_products_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table `product_image` add constraint `product_image_file_id_foreign` foreign key (`file_id`) references `file` (`id`) on update cascade;'
    )
    this.addSql(
      'alter table `product_image` add constraint `product_image_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `user` add constraint `user_role_id_foreign` foreign key (`role_id`) references `role` (`id`) on update cascade;'
    )
  }
}
