import { Migration } from '@mikro-orm/migrations';

export class Migration20240914211041 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `payment` modify `paid` tinyint(1);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `payment` modify `paid` varchar(255) default null;');
  }

}
