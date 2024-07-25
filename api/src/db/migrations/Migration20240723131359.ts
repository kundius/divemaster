import { Migration } from '@mikro-orm/migrations';

export class Migration20240723131359 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `offer` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) null, `price` int not null, `product_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `offer` add index `offer_product_id_index`(`product_id`);');

    this.addSql('create table `offer_option_values` (`offer_id` int unsigned not null, `option_value_id` int unsigned not null, primary key (`offer_id`, `option_value_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `offer_option_values` add index `offer_option_values_offer_id_index`(`offer_id`);');
    this.addSql('alter table `offer_option_values` add index `offer_option_values_option_value_id_index`(`option_value_id`);');

    this.addSql('alter table `offer` add constraint `offer_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');

    this.addSql('alter table `offer_option_values` add constraint `offer_option_values_offer_id_foreign` foreign key (`offer_id`) references `offer` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `offer_option_values` add constraint `offer_option_values_option_value_id_foreign` foreign key (`option_value_id`) references `option_value` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `option` modify `type` enum(\'combo-boolean\', \'combo-colors\', \'combo-options\', \'numberfield\', \'textfield\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `offer_option_values` drop foreign key `offer_option_values_offer_id_foreign`;');

    this.addSql('drop table if exists `offer`;');

    this.addSql('drop table if exists `offer_option_values`;');

    this.addSql('alter table `option` modify `type` enum(\'string\', \'number\', \'boolean\', \'color\', \'size\', \'combo-boolean\', \'combo-colors\', \'combo-options\', \'combobox\', \'numberfield\', \'textfield\', \'textarea\') not null;');
  }

}
