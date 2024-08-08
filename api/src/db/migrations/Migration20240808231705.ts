import { Migration } from '@mikro-orm/migrations';

export class Migration20240808231705 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `letter` (`uuid` varchar(36) not null, `to` varchar(255) not null, `from` varchar(255) not null, `message_id` varchar(255) null, `status` enum(\'sent\', \'received\', \'read\', \'fail\') not null, `read_count` int not null, `status_updated_at` datetime not null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `letter`;');
  }

}
