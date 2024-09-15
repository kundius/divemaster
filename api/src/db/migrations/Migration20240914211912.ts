import { Migration } from '@mikro-orm/migrations';

export class Migration20240914211912 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `payment` modify `paid` tinyint;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `payment` modify `paid` tinyint(1);');
  }

}
