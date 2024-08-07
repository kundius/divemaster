import { Migration } from '@mikro-orm/migrations';

export class Migration20240806230912 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `cart_product` drop column `price`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `cart_product` add `price` int not null;');
  }

}
