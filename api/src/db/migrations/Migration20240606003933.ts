import { Migration } from '@mikro-orm/migrations'

export class Migration20240606003933 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `product` add `specifications` text null, add `exploitation` text null;'
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `product` drop column `specifications`, drop column `exploitation`;')
  }
}
