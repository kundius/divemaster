import { Migration } from '@mikro-orm/migrations';

export class Migration20240920171549 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `blog_post` drop column `active`;');

    this.addSql('alter table `blog_post` add `status` enum(\'published\', \'draft\', \'archived\') not null default \'draft\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table `blog_post` drop column `status`;');

    this.addSql('alter table `blog_post` add `active` tinyint(1) not null default true;');
  }

}
