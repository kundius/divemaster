import { Migration } from '@mikro-orm/migrations';

export class Migration20240723142252 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `offer` add `rank` int not null default 0;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `offer` drop column `rank`;');
  }

}
