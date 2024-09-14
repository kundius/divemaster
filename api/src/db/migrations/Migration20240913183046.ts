import { Migration } from '@mikro-orm/migrations';

export class Migration20240913183046 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `order` drop foreign key `order_payment_id_foreign`;');
    this.addSql('alter table `order` drop foreign key `order_delivery_id_foreign`;');

    this.addSql('alter table `order` drop index `order_payment_id_unique`;');
    this.addSql('alter table `order` drop index `order_delivery_id_unique`;');
    this.addSql('alter table `order` drop column `payment_id`, drop column `delivery_id`;');

    this.addSql('alter table `payment` add `order_id` int unsigned not null;');
    this.addSql('alter table `payment` add constraint `payment_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade;');
    this.addSql('alter table `payment` add unique `payment_order_id_unique`(`order_id`);');

    this.addSql('alter table `delivery` add `order_id` int unsigned not null;');
    this.addSql('alter table `delivery` add constraint `delivery_order_id_foreign` foreign key (`order_id`) references `order` (`id`) on update cascade;');
    this.addSql('alter table `delivery` add unique `delivery_order_id_unique`(`order_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `delivery` drop foreign key `delivery_order_id_foreign`;');

    this.addSql('alter table `payment` drop foreign key `payment_order_id_foreign`;');

    this.addSql('alter table `delivery` drop index `delivery_order_id_unique`;');
    this.addSql('alter table `delivery` drop column `order_id`;');

    this.addSql('alter table `payment` drop index `payment_order_id_unique`;');
    this.addSql('alter table `payment` drop column `order_id`;');

    this.addSql('alter table `order` add `payment_id` int unsigned not null, add `delivery_id` int unsigned not null;');
    this.addSql('alter table `order` add constraint `order_payment_id_foreign` foreign key (`payment_id`) references `payment` (`id`) on update cascade;');
    this.addSql('alter table `order` add constraint `order_delivery_id_foreign` foreign key (`delivery_id`) references `delivery` (`id`) on update cascade;');
    this.addSql('alter table `order` add unique `order_payment_id_unique`(`payment_id`);');
    this.addSql('alter table `order` add unique `order_delivery_id_unique`(`delivery_id`);');
  }

}
