import { Migration } from '@mikro-orm/migrations';

export class Migration20240907235649 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `city` modify `lat` numeric(10,0) not null, modify `lon` numeric(10,0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `city` modify `lat` int not null, modify `lon` int not null;');
  }

}
