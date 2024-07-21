import { Migration } from '@mikro-orm/migrations';

export class Migration20240720094301 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `option` modify `type` enum(\'string\', \'number\', \'boolean\', \'color\', \'size\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `option` modify `type` enum(\'text\', \'number\', \'boolean\', \'color\', \'size\', \'variant\') not null;');
  }

}
