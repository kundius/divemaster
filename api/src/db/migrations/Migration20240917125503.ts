import { Migration } from '@mikro-orm/migrations';

export class Migration20240917125503 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `payment` modify `paid_at` datetime null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `payment` modify `paid_at` datetime not null;');
  }

}
