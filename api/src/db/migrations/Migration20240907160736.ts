import { Migration } from '@mikro-orm/migrations';

export class Migration20240907160736 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pickup_point` drop column `region_code`, drop column `city_code`, drop column `city_name`, drop column `address`;');

    this.addSql('alter table `pickup_point` add `locality_type` varchar(255) not null default \'\', add `locality_name` varchar(255) not null default \'\', add `short_address` varchar(255) not null default \'\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pickup_point` drop column `locality_type`, drop column `locality_name`, drop column `short_address`;');

    this.addSql('alter table `pickup_point` add `region_code` varchar(255) not null default \'\', add `city_code` varchar(255) not null default \'\', add `city_name` varchar(255) not null default \'\', add `address` varchar(255) not null default \'\';');
  }

}
