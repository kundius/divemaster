import { Migration } from '@mikro-orm/migrations';

export class Migration20240914235632 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `order` add `composition` json null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order` drop column `composition`;');
  }

}
