import { Migration } from '@mikro-orm/migrations';

export class Migration20240806172506 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `cart_product` add `price` int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `cart_product` drop column `price`;');
  }

}
