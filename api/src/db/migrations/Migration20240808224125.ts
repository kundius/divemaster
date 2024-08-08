import { Migration } from '@mikro-orm/migrations';

export class Migration20240808224125 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `order` drop index `order_user_id_unique`;');

    this.addSql('alter table `order` add index `order_user_id_index`(`user_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order` drop index `order_user_id_index`;');

    this.addSql('alter table `order` add unique `order_user_id_unique`(`user_id`);');
  }

}
