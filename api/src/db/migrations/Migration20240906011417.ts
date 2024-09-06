import { Migration } from '@mikro-orm/migrations';

export class Migration20240906011417 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pickup_point` add `lat` varchar(255) not null default \'\', add `lon` varchar(255) not null default \'\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pickup_point` drop column `lat`, drop column `lon`;');
  }

}
