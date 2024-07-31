import { Migration } from '@mikro-orm/migrations';

export class Migration20240730113816 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `product` drop column `price`;');

    this.addSql('alter table `product` change `old_price` `price_decrease` int null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `product` add `price` int not null;');
    this.addSql('alter table `product` change `price_decrease` `old_price` int null;');
  }

}
