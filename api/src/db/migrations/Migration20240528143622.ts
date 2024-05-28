import { Migration } from '@mikro-orm/migrations'

export class Migration20240528143622 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `category` add `image_id` int unsigned null;')
    this.addSql(
      'alter table `category` add constraint `category_image_id_foreign` foreign key (`image_id`) references `file` (`id`) on update cascade on delete set null;'
    )
    this.addSql('alter table `category` add index `category_image_id_index`(`image_id`);')
  }

  async down(): Promise<void> {
    this.addSql('alter table `category` drop foreign key `category_image_id_foreign`;')

    this.addSql('alter table `category` drop index `category_image_id_index`;')
    this.addSql('alter table `category` drop column `image_id`;')
  }
}
