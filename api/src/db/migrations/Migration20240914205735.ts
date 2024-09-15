import { Migration } from '@mikro-orm/migrations';

export class Migration20240914205735 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `payment` modify `paid` varchar(255) null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `payment` modify `paid` tinyint(1) not null default false;');
  }

}
