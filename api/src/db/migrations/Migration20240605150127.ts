import { Migration } from '@mikro-orm/migrations';

export class Migration20240605150127 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `product_content` (`id` int unsigned not null, `product_id` int unsigned not null, `title` varchar(255) not null, `content` varchar(255) not null, `rank` int not null default 0, primary key (`id`, `product_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `product_content` add index `product_content_product_id_index`(`product_id`);');

    this.addSql('alter table `product_content` add constraint `product_content_product_id_foreign` foreign key (`product_id`) references `product` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `product_content`;');
  }

}
