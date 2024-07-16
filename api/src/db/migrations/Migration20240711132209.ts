import { Migration } from '@mikro-orm/migrations';

export class Migration20240711132209 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `cart` (`uuid` varchar(36) not null, `user_id` int unsigned null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `cart` add index `cart_user_id_index`(`user_id`);');

    this.addSql('create table `cart_product` (`cart_uuid` varchar(36) not null, `product_key` varchar(255) not null, `product_id` int unsigned not null, `amount` int unsigned not null default 1, `options` json null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`cart_uuid`, `product_key`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `cart_product` add index `cart_product_cart_uuid_index`(`cart_uuid`);');
    this.addSql('alter table `cart_product` add index `cart_product_product_id_index`(`product_id`);');

    this.addSql('alter table `cart` add constraint `cart_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `cart_product` add constraint `cart_product_cart_uuid_foreign` foreign key (`cart_uuid`) references `cart` (`uuid`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product` add constraint `cart_product_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `cart_product` drop foreign key `cart_product_cart_uuid_foreign`;');

    this.addSql('drop table if exists `cart`;');

    this.addSql('drop table if exists `cart_product`;');
  }

}
