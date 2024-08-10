import { Migration } from '@mikro-orm/migrations';

export class Migration20240809234906 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `brand` add `remote_id` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `brand` drop column `remote_id`;');
  }

}
