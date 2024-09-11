import { Migration } from '@mikro-orm/migrations'

export class Migration20240910211321 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `user` add `discount` int not null default 0;')

    this.addSql(
      'alter table `order` drop column `customer_phone`, drop column `customer_email`, drop column `customer_name`;'
    )

    this.addSql('alter table `order_product` add `title` varchar(255) not null;')
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop column `discount`;')

    this.addSql(
      'alter table `order` add `customer_phone` varchar(255) null, add `customer_email` varchar(255) null, add `customer_name` varchar(255) null;'
    )

    this.addSql('alter table `order_product` drop column `title`;')
  }
}
