import { Migration } from '@mikro-orm/migrations';

export class Migration20240808214014 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `order` (`id` varchar(36) not null, `cost` int unsigned not null, `customer_phone` varchar(255) null, `customer_email` varchar(255) null, `customer_name` varchar(255) null, `user_id` int unsigned null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order` add unique `order_user_id_unique`(`user_id`);');

    this.addSql('create table `order_product` (`id` varchar(36) not null, `order_id` varchar(36) not null, `product_id` int unsigned not null, `amount` int unsigned not null, `price` int unsigned not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order_product` add index `order_product_order_id_index`(`order_id`);');
    this.addSql('alter table `order_product` add index `order_product_product_id_index`(`product_id`);');

    this.addSql('create table `order_product_option_values` (`order_product_id` varchar(36) not null, `option_value_id` int unsigned not null, primary key (`order_product_id`, `option_value_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order_product_option_values` add index `order_product_option_values_order_product_id_index`(`order_product_id`);');
    this.addSql('alter table `order_product_option_values` add index `order_product_option_values_option_value_id_index`(`option_value_id`);');

    this.addSql('alter table `order` add constraint `order_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `order_product` add constraint `order_product_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `order_product` add constraint `order_product_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `order_product_option_values` add constraint `order_product_option_values_order_product_id_foreign` foreign key (`order_product_id`) references `order_product` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `order_product_option_values` add constraint `order_product_option_values_option_value_id_foreign` foreign key (`option_value_id`) references `option_value` (`id`) on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order_product` drop foreign key `order_product_order_id_foreign`;');

    this.addSql('alter table `order_product_option_values` drop foreign key `order_product_option_values_order_product_id_foreign`;');

    this.addSql('drop table if exists `order`;');

    this.addSql('drop table if exists `order_product`;');

    this.addSql('drop table if exists `order_product_option_values`;');
  }

}
