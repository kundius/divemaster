import { Migration } from '@mikro-orm/migrations'

export class Migration20240531213714 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `brand` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null) default character set utf8mb4 engine = InnoDB;'
    )

    this.addSql(
      'create table `brand_products` (`brand_id` int unsigned not null, `product_id` int unsigned not null, primary key (`brand_id`, `product_id`)) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `brand_products` add index `brand_products_brand_id_index`(`brand_id`);'
    )
    this.addSql(
      'alter table `brand_products` add index `brand_products_product_id_index`(`product_id`);'
    )

    this.addSql(
      'alter table `brand_products` add constraint `brand_products_brand_id_foreign` foreign key (`brand_id`) references `brand` (`id`) on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table `brand_products` add constraint `brand_products_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade on delete cascade;'
    )

    this.addSql('alter table `product` add `brand_id` int unsigned null;')
    this.addSql(
      'alter table `product` add constraint `product_brand_id_foreign` foreign key (`brand_id`) references `brand` (`id`) on update cascade on delete set null;'
    )
    this.addSql('alter table `product` add index `product_brand_id_index`(`brand_id`);')
  }

  async down(): Promise<void> {
    this.addSql('alter table `product` drop foreign key `product_brand_id_foreign`;')

    this.addSql('alter table `brand_products` drop foreign key `brand_products_brand_id_foreign`;')

    this.addSql('drop table if exists `brand`;')

    this.addSql('drop table if exists `brand_products`;')

    this.addSql('alter table `product` drop index `product_brand_id_index`;')
    this.addSql('alter table `product` drop column `brand_id`;')
  }
}
