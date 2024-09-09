import { Migration } from '@mikro-orm/migrations';

export class Migration20240908000411 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `city` add `type` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `city` drop column `type`;');
  }

}
