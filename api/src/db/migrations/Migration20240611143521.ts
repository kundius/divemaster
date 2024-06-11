import { Migration } from '@mikro-orm/migrations';

export class Migration20240611143521 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `option` (`id` int unsigned not null auto_increment primary key, `key` varchar(255) not null, `caption` varchar(255) not null, `type` enum(\'color\', \'size\', \'variant\') not null, `in_filter` tinyint(1) not null default false, `in_cart` tinyint(1) not null default false, `rank` int not null default 0, `properties` json null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `option` add unique `option_key_unique`(`key`);');

    this.addSql('create table `category_options` (`category_id` int unsigned not null, `option_id` int unsigned not null, primary key (`category_id`, `option_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `category_options` add index `category_options_category_id_index`(`category_id`);');
    this.addSql('alter table `category_options` add index `category_options_option_id_index`(`option_id`);');

    this.addSql('create table `option_variant` (`id` int unsigned not null auto_increment primary key, `value` varchar(255) not null, `option_id` int unsigned not null, `product_id` int unsigned not null, `rank` int not null default 0) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `option_variant` add index `option_variant_option_id_index`(`option_id`);');
    this.addSql('alter table `option_variant` add index `option_variant_product_id_index`(`product_id`);');

    this.addSql('alter table `category_options` add constraint `category_options_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `category_options` add constraint `category_options_option_id_foreign` foreign key (`option_id`) references `option` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `option_variant` add constraint `option_variant_option_id_foreign` foreign key (`option_id`) references `option` (`id`) on update cascade;');
    this.addSql('alter table `option_variant` add constraint `option_variant_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `category_options` drop foreign key `category_options_option_id_foreign`;');

    this.addSql('alter table `option_variant` drop foreign key `option_variant_option_id_foreign`;');

    this.addSql('drop table if exists `option`;');

    this.addSql('drop table if exists `category_options`;');

    this.addSql('drop table if exists `option_variant`;');
  }

}
