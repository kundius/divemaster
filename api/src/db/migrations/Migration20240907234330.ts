import { Migration } from '@mikro-orm/migrations';

export class Migration20240907234330 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `city` (`id` varchar(36) not null, `name` varchar(255) not null, `subject` varchar(255) not null, `district` varchar(255) not null, `lat` int not null, `lon` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `city`;');
  }

}
