import { Migration } from '@mikro-orm/migrations';

export class Migration20240913182835 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `delivery` (`id` int unsigned not null auto_increment primary key, `service` enum(\'Pickup\', \'Shipping\') not null, `delivered` tinyint(1) not null default false, `address` varchar(255) not null, `recipient` json null, `created_at` datetime not null, `delivered_at` datetime not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `payment` (`id` int unsigned not null auto_increment primary key, `service` enum(\'Yookassa\', \'UponCash\') not null, `paid` tinyint(1) not null default false, `link` varchar(255) null, `created_at` datetime not null, `paid_at` datetime not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `order` drop column `status`, drop column `delivery`, drop column `payment`, drop column `recipient`, drop column `updated_at`;');

    this.addSql('alter table `order` add `amount` int unsigned not null, add `payment_id` int unsigned not null, add `delivery_id` int unsigned not null;');
    this.addSql('alter table `order` add constraint `order_payment_id_foreign` foreign key (`payment_id`) references `payment` (`id`) on update cascade;');
    this.addSql('alter table `order` add constraint `order_delivery_id_foreign` foreign key (`delivery_id`) references `delivery` (`id`) on update cascade;');
    this.addSql('alter table `order` add unique `order_hash_unique`(`hash`);');
    this.addSql('alter table `order` add unique `order_payment_id_unique`(`payment_id`);');
    this.addSql('alter table `order` add unique `order_delivery_id_unique`(`delivery_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order` drop foreign key `order_delivery_id_foreign`;');

    this.addSql('alter table `order` drop foreign key `order_payment_id_foreign`;');

    this.addSql('drop table if exists `delivery`;');

    this.addSql('drop table if exists `payment`;');

    this.addSql('alter table `order` drop index `order_hash_unique`;');
    this.addSql('alter table `order` drop index `order_payment_id_unique`;');
    this.addSql('alter table `order` drop index `order_delivery_id_unique`;');
    this.addSql('alter table `order` drop column `amount`, drop column `payment_id`, drop column `delivery_id`;');

    this.addSql('alter table `order` add `status` enum(\'NEW\', \'CANCELLED\', \'PAID\') not null, add `delivery` enum(\'SHIPPING\', \'PICKUP\') not null, add `payment` enum(\'ONLINE\', \'OFFLINE\') not null, add `recipient` json null, add `updated_at` datetime not null;');
  }

}
