import { Migration } from '@mikro-orm/migrations'

export class Migration20240912142611 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `order` add `status` enum('SHIPPING', 'PICKUP') not null, add `recipient` json null;"
    )

    this.addSql(
      'alter table `cart_product` add `old_price` int null default null, add `price` int null default null, add `active` tinyint(1) not null default true;'
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `order` drop column `status`, drop column `recipient`;')

    this.addSql(
      'alter table `order` add `recipient_name` varchar(255) not null, add `recipient_phone` varchar(255) not null, add `recipient_email` varchar(255) not null;'
    )
  }
}
