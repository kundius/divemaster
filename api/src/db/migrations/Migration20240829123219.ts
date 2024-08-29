import { Migration } from '@mikro-orm/migrations';

export class Migration20240829123219 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `category` add `rank` int not null default 0;');

    this.addSql('alter table `product` add `rank` int not null default 0;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `category` drop column `rank`;');

    this.addSql('alter table `product` drop column `rank`;');
  }

}
