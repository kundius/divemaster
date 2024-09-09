import { Migration } from '@mikro-orm/migrations';

export class Migration20240907235745 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `city` modify `lat` float not null, modify `lon` float not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `city` modify `lat` numeric(10,0) not null, modify `lon` numeric(10,0) not null;');
  }

}
