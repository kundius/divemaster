import { Migration } from '@mikro-orm/migrations';

export class Migration20240906020234 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pickup_point` add `city_code` varchar(255) not null default \'\', add `city_name` varchar(255) not null default \'\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pickup_point` drop column `city_code`, drop column `city_name`;');
  }

}
