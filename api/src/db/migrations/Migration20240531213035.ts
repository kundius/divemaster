import { Migration } from '@mikro-orm/migrations'

export class Migration20240531213035 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `product` add `old_price` int null, add `in_stock` tinyint(1) not null default true, add `recent` tinyint(1) not null default false, add `favorite` tinyint(1) not null default false;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `product` drop column `old_price`, drop column `in_stock`, drop column `recent`, drop column `favorite`;'
    )
  }
}
