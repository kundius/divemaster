import { Migration } from '@mikro-orm/migrations';

export class Migration20240806024738 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `cart_product` drop foreign key `cart_product_cart_uuid_foreign`;');

    this.addSql('alter table `cart_product_option_values` drop foreign key `cart_product_option_values_cart_product_uuid_cart_1c143_foreign`;');

    this.addSql('alter table `cart` drop primary key;');

    this.addSql('alter table `cart` change `uuid` `id` varchar(36) not null;');
    this.addSql('alter table `cart` add primary key `cart_pkey`(`id`);');

    this.addSql('alter table `cart_product` drop index `cart_product_cart_uuid_index`;');
    this.addSql('alter table `cart_product` drop primary key;');

    this.addSql('alter table `cart_product` change `uuid` `id` varchar(36) not null;');
    this.addSql('alter table `cart_product` change `cart_uuid` `cart_id` varchar(36) not null;');
    this.addSql('alter table `cart_product` add constraint `cart_product_cart_id_foreign` foreign key (`cart_id`) references `cart` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product` add index `cart_product_cart_id_index`(`cart_id`);');
    this.addSql('alter table `cart_product` add primary key `cart_product_pkey`(`id`, `cart_id`);');

    this.addSql('alter table `cart_product_option_values` drop index `cart_product_option_values_cart_product_uuid_cart_p_1ea38_index`;');
    this.addSql('alter table `cart_product_option_values` drop primary key;');
    this.addSql('alter table `cart_product_option_values` drop column `cart_product_uuid`, drop column `cart_product_cart_uuid`;');

    this.addSql('alter table `cart_product_option_values` add `cart_product_id` varchar(36) not null, add `cart_product_cart_id` varchar(36) not null;');
    this.addSql('alter table `cart_product_option_values` add constraint `cart_product_option_values_cart_product_id_cart_p_3e721_foreign` foreign key (`cart_product_id`, `cart_product_cart_id`) references `cart_product` (`id`, `cart_id`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product_option_values` add index `cart_product_option_values_cart_product_id_cart_pro_336d4_index`(`cart_product_id`, `cart_product_cart_id`);');
    this.addSql('alter table `cart_product_option_values` add primary key `cart_product_option_values_pkey`(`cart_product_id`, `cart_product_cart_id`, `option_value_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `cart_product` drop foreign key `cart_product_cart_id_foreign`;');

    this.addSql('alter table `cart_product_option_values` drop foreign key `cart_product_option_values_cart_product_id_cart_p_3e721_foreign`;');

    this.addSql('alter table `cart` drop primary key;');

    this.addSql('alter table `cart` change `id` `uuid` varchar(36) not null;');
    this.addSql('alter table `cart` add primary key `cart_pkey`(`uuid`);');

    this.addSql('alter table `cart_product` drop index `cart_product_cart_id_index`;');
    this.addSql('alter table `cart_product` drop primary key;');

    this.addSql('alter table `cart_product` change `id` `uuid` varchar(36) not null;');
    this.addSql('alter table `cart_product` change `cart_id` `cart_uuid` varchar(36) not null;');
    this.addSql('alter table `cart_product` add constraint `cart_product_cart_uuid_foreign` foreign key (`cart_uuid`) references `cart` (`uuid`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product` add index `cart_product_cart_uuid_index`(`cart_uuid`);');
    this.addSql('alter table `cart_product` add primary key `cart_product_pkey`(`uuid`, `cart_uuid`);');

    this.addSql('alter table `cart_product_option_values` drop index `cart_product_option_values_cart_product_id_cart_pro_336d4_index`;');
    this.addSql('alter table `cart_product_option_values` drop primary key;');
    this.addSql('alter table `cart_product_option_values` drop column `cart_product_id`, drop column `cart_product_cart_id`;');

    this.addSql('alter table `cart_product_option_values` add `cart_product_uuid` varchar(36) not null, add `cart_product_cart_uuid` varchar(36) not null;');
    this.addSql('alter table `cart_product_option_values` add constraint `cart_product_option_values_cart_product_uuid_cart_1c143_foreign` foreign key (`cart_product_uuid`, `cart_product_cart_uuid`) references `cart_product` (`uuid`, `cart_uuid`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product_option_values` add index `cart_product_option_values_cart_product_uuid_cart_p_1ea38_index`(`cart_product_uuid`, `cart_product_cart_uuid`);');
    this.addSql('alter table `cart_product_option_values` add primary key `cart_product_option_values_pkey`(`cart_product_uuid`, `cart_product_cart_uuid`, `option_value_id`);');
  }

}
