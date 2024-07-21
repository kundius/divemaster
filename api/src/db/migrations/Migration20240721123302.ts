import { Migration } from '@mikro-orm/migrations';

export class Migration20240721123302 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `option` modify `type` enum(\'string\', \'number\', \'boolean\', \'color\', \'size\', \'combo-boolean\', \'combo-colors\', \'combo-options\', \'combobox\', \'numberfield\', \'textfield\', \'textarea\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `option` modify `type` enum(\'string\', \'number\', \'boolean\', \'color\', \'size\') not null;');
  }

}
