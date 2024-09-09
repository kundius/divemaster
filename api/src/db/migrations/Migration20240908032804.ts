import { Migration } from '@mikro-orm/migrations'

export class Migration20240908032804 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `pickup_point` drop column `region_name`, drop column `locality_type`, drop column `locality_name`;'
    )

    this.addSql(
      'alter table `pickup_point` add `district_name` varchar(255) not null, add `subject_name` varchar(255) not null, add `city_type` varchar(255) not null;'
    )
    this.addSql(
      'alter table `pickup_point` modify `name` varchar(255) not null, modify `city_name` varchar(255) not null, modify `full_address` varchar(255) not null, modify `short_address` varchar(255) not null, modify `phone` varchar(255) null, modify `email` varchar(255) null, modify `work_time` varchar(255) not null, modify `lat` float not null, modify `lon` float not null, modify `note` varchar(255) null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `pickup_point` drop column `district_name`, drop column `subject_name`, drop column `city_type`;'
    )

    this.addSql(
      "alter table `pickup_point` add `region_name` varchar(255) not null default '', add `locality_type` varchar(255) not null default '', add `locality_name` varchar(255) not null default '';"
    )
    this.addSql(
      "alter table `pickup_point` modify `name` varchar(255) not null default '', modify `city_name` varchar(255) not null default '', modify `full_address` varchar(255) not null default '', modify `short_address` varchar(255) not null default '', modify `phone` varchar(255) not null default '', modify `email` varchar(255) not null default '', modify `work_time` varchar(255) not null default '', modify `lat` varchar(255) not null default '', modify `lon` varchar(255) not null default '', modify `note` varchar(255) not null default '';"
    )
  }
}
