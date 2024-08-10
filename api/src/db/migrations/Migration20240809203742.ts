import { Migration } from '@mikro-orm/migrations';

export class Migration20240809203742 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `category` add `remote_id` varchar(255) null;');

    this.addSql('alter table `product` add `remote_id` varchar(255) null;');

    this.addSql('alter table `offer` add `remote_id` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `category` drop column `remote_id`;');

    this.addSql('alter table `product` drop column `remote_id`;');

    this.addSql('alter table `offer` drop column `remote_id`;');
  }

}
