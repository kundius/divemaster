import { Migration } from '@mikro-orm/migrations';

export class Migration20240806133713 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `cart_product_option_values` drop foreign key `cart_product_option_values_cart_product_id_cart_p_3e721_foreign`;');

    this.addSql('alter table `cart_product` drop primary key;');

    this.addSql('alter table `cart_product` add primary key `cart_product_pkey`(`id`);');

    this.addSql('alter table `cart_product_option_values` drop index `cart_product_option_values_cart_product_id_cart_pro_336d4_index`;');
    this.addSql('alter table `cart_product_option_values` drop primary key;');
    this.addSql('alter table `cart_product_option_values` drop column `cart_product_cart_id`;');

    this.addSql('alter table `cart_product_option_values` add constraint `cart_product_option_values_cart_product_id_foreign` foreign key (`cart_product_id`) references `cart_product` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product_option_values` add index `cart_product_option_values_cart_product_id_index`(`cart_product_id`);');
    this.addSql('alter table `cart_product_option_values` add primary key `cart_product_option_values_pkey`(`cart_product_id`, `option_value_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `cart_product_option_values` drop foreign key `cart_product_option_values_cart_product_id_foreign`;');

    this.addSql('alter table `cart_product` drop primary key;');

    this.addSql('alter table `cart_product` add primary key `cart_product_pkey`(`id`, `cart_id`);');

    this.addSql('alter table `cart_product_option_values` drop index `cart_product_option_values_cart_product_id_index`;');
    this.addSql('alter table `cart_product_option_values` drop primary key;');

    this.addSql('alter table `cart_product_option_values` add `cart_product_cart_id` varchar(36) not null;');
    this.addSql('alter table `cart_product_option_values` add constraint `cart_product_option_values_cart_product_id_cart_p_3e721_foreign` foreign key (`cart_product_id`, `cart_product_cart_id`) references `cart_product` (`id`, `cart_id`) on update cascade on delete cascade;');
    this.addSql('alter table `cart_product_option_values` add index `cart_product_option_values_cart_product_id_cart_pro_336d4_index`(`cart_product_id`, `cart_product_cart_id`);');
    this.addSql('alter table `cart_product_option_values` add primary key `cart_product_option_values_pkey`(`cart_product_id`, `cart_product_cart_id`, `option_value_id`);');
  }

}
