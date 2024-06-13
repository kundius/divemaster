import { Migration } from '@mikro-orm/migrations';

export class Migration20240613162020 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `option` drop column `properties`;');

    this.addSql('alter table `option_variant` add `properties` json null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `option` add `properties` json null;');

    this.addSql('alter table `option_variant` drop column `properties`;');
  }

}
