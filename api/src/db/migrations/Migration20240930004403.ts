import { Migration } from '@mikro-orm/migrations';

export class Migration20240930004403 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pickup_point` add `type` enum(\'cdek\', \'store\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pickup_point` drop column `type`;');
  }

}
