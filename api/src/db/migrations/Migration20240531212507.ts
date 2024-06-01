import { Migration } from '@mikro-orm/migrations'

export class Migration20240531212507 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `category` add `long_title` varchar(255) null;')

    this.addSql('alter table `product` add `long_title` varchar(255) null;')
  }

  async down(): Promise<void> {
    this.addSql('alter table `category` drop column `long_title`;')

    this.addSql('alter table `product` drop column `long_title`;')
  }
}
