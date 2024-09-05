import { Migration } from '@mikro-orm/migrations';

export class Migration20240904235034 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `pickup_point` (`id` varchar(36) not null, `region` varchar(255) not null default \'\', `address` varchar(255) not null default \'\', `phone` varchar(255) not null default \'\', `email` varchar(255) not null default \'\', `timetable` varchar(255) not null default \'\', `note` varchar(255) not null default \'\', `is_reception` tinyint(1) not null default false, `is_dressing_room` tinyint(1) not null default false, `allowed_cod` tinyint(1) not null default false, `have_cash` tinyint(1) not null default false, `have_cashless` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `pickup_point`;');
  }

}
