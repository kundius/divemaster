import { Migration } from '@mikro-orm/migrations';

export class Migration20240721123340 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `option` drop column `is_multiple`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `option` add `is_multiple` tinyint(1) not null default false;');
  }

}
