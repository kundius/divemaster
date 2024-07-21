import { Migration } from '@mikro-orm/migrations';

export class Migration20240719230126 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `option_value` (`id` int unsigned not null auto_increment primary key, `content` varchar(255) not null, `option_id` int unsigned not null, `product_id` int unsigned not null, `rank` int not null default 0, `properties` json null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `option_value` add index `option_value_option_id_index`(`option_id`);');
    this.addSql('alter table `option_value` add index `option_value_product_id_index`(`product_id`);');

    this.addSql('alter table `option_value` add constraint `option_value_option_id_foreign` foreign key (`option_id`) references `option` (`id`) on update cascade;');
    this.addSql('alter table `option_value` add constraint `option_value_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('drop table if exists `option_variant`;');

    this.addSql('alter table `option` change `in_cart` `is_multiple` tinyint(1) not null default false;');

    this.addSql('alter table `cart` drop index `cart_user_id_index`;');

    this.addSql('alter table `cart` add unique `cart_user_id_unique`(`user_id`);');
  }

  async down(): Promise<void> {
    this.addSql('create table `option_variant` (`id` int unsigned not null auto_increment primary key, `value` varchar(255) not null, `option_id` int unsigned not null, `product_id` int unsigned not null, `rank` int not null default 0, `properties` json null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `option_variant` add index `option_variant_option_id_index`(`option_id`);');
    this.addSql('alter table `option_variant` add index `option_variant_product_id_index`(`product_id`);');

    this.addSql('alter table `option_variant` add constraint `option_variant_option_id_foreign` foreign key (`option_id`) references `option` (`id`) on update cascade;');
    this.addSql('alter table `option_variant` add constraint `option_variant_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('drop table if exists `option_value`;');

    this.addSql('alter table `option` change `is_multiple` `in_cart` tinyint(1) not null default false;');

    this.addSql('alter table `cart` drop index `cart_user_id_unique`;');

    this.addSql('alter table `cart` add index `cart_user_id_index`(`user_id`);');
  }

}
