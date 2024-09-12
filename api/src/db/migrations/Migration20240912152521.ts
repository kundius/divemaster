import { Migration } from '@mikro-orm/migrations';

export class Migration20240912152521 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `cart_product` drop column `old_price`, drop column `price`, drop column `active`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `cart_product` add `old_price` int null default null, add `price` int null default null, add `active` tinyint(1) not null default true;');
  }

}
