import { Migration } from '@mikro-orm/migrations';

export class Migration20240914212916 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `delivery` modify `delivered` tinyint null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `delivery` modify `delivered` tinyint(1) not null default false;');
  }

}
