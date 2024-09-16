import { Migration } from '@mikro-orm/migrations';

export class Migration20240916130926 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `order` drop column `amount`;');

    this.addSql('alter table `order_product` change `amount` `quantity` int unsigned not null;');

    this.addSql('alter table `cart_product` change `amount` `quantity` int unsigned not null default 1;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order` add `amount` int unsigned not null;');

    this.addSql('alter table `order_product` change `quantity` `amount` int unsigned not null;');

    this.addSql('alter table `cart_product` change `quantity` `amount` int unsigned not null default 1;');
  }

}
