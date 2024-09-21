import { Migration } from '@mikro-orm/migrations';

export class Migration20240921130407 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `blog_tag` change `seo` `metadata` json null;');

    this.addSql('alter table `blog_post` change `seo` `metadata` json null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `blog_tag` change `metadata` `seo` json null;');

    this.addSql('alter table `blog_post` change `metadata` `seo` json null;');
  }

}
