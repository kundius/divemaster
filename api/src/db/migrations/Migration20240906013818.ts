import { Migration } from '@mikro-orm/migrations';

export class Migration20240906013818 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pickup_point` drop column `region`, drop column `timetable`;');

    this.addSql('alter table `pickup_point` add `name` varchar(255) not null default \'\', add `region_code` varchar(255) not null default \'\', add `region_name` varchar(255) not null default \'\', add `full_address` varchar(255) not null default \'\', add `work_time` varchar(255) not null default \'\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pickup_point` drop column `name`, drop column `region_code`, drop column `region_name`, drop column `full_address`, drop column `work_time`;');

    this.addSql('alter table `pickup_point` add `region` varchar(255) not null default \'\', add `timetable` varchar(255) not null default \'\';');
  }

}
