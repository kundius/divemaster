import { Migration } from '@mikro-orm/migrations';

export class Migration20240628144730 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `option` modify `type` enum(\'text\', \'number\', \'boolean\', \'color\', \'size\', \'variant\', \'options\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `option` modify `type` enum(\'text\', \'number\', \'boolean\', \'color\', \'size\', \'options\') not null;');
  }

}
