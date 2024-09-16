import { Migration } from '@mikro-orm/migrations';

export class Migration20240915182914 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists `letter`;');

    this.addSql('alter table `payment` add `remote_id` varchar(255) null default null;');
  }

  async down(): Promise<void> {
    this.addSql('create table `letter` (`uuid` varchar(36) not null, `to` varchar(255) not null, `from` varchar(255) not null, `message_id` varchar(255) null, `status` enum(\'sent\', \'received\', \'read\', \'fail\') not null, `read_count` int not null, `status_updated_at` datetime not null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `payment` drop column `remote_id`;');
  }

}
