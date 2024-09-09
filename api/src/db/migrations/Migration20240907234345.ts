import { Migration } from '@mikro-orm/migrations';

export class Migration20240907234345 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pickup_point` add `city_name` varchar(255) not null default \'\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pickup_point` drop column `city_name`;');
  }

}
