import { Migration } from '@mikro-orm/migrations';

export class Migration20240617004124 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `option` modify `type` enum(\'text\', \'number\', \'boolean\', \'color\', \'size\', \'options\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `option` modify `type` enum(\'color\', \'size\', \'variant\') not null;');
  }

}
