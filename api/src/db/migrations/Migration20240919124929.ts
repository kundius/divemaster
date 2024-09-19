import { Migration } from '@mikro-orm/migrations';

export class Migration20240919124929 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `blog_tag` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `alias` varchar(255) not null, `seo` json null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `blog_tag` add unique `blog_tag_alias_unique`(`alias`);');

    this.addSql('create table `blog_post` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `long_title` varchar(255) null, `alias` varchar(255) not null, `content` text null, `read_time` varchar(255) null, `active` tinyint(1) not null default true, `seo` json null, `created_at` datetime not null, `updated_at` datetime not null, `image_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `blog_post` add unique `blog_post_alias_unique`(`alias`);');
    this.addSql('alter table `blog_post` add index `blog_post_image_id_index`(`image_id`);');

    this.addSql('create table `blog_tag_posts` (`blog_tag_id` int unsigned not null, `blog_post_id` int unsigned not null, primary key (`blog_tag_id`, `blog_post_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `blog_tag_posts` add index `blog_tag_posts_blog_tag_id_index`(`blog_tag_id`);');
    this.addSql('alter table `blog_tag_posts` add index `blog_tag_posts_blog_post_id_index`(`blog_post_id`);');

    this.addSql('alter table `blog_post` add constraint `blog_post_image_id_foreign` foreign key (`image_id`) references `file` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `blog_tag_posts` add constraint `blog_tag_posts_blog_tag_id_foreign` foreign key (`blog_tag_id`) references `blog_tag` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `blog_tag_posts` add constraint `blog_tag_posts_blog_post_id_foreign` foreign key (`blog_post_id`) references `blog_post` (`id`) on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `blog_tag_posts` drop foreign key `blog_tag_posts_blog_tag_id_foreign`;');

    this.addSql('alter table `blog_tag_posts` drop foreign key `blog_tag_posts_blog_post_id_foreign`;');

    this.addSql('drop table if exists `blog_tag`;');

    this.addSql('drop table if exists `blog_post`;');

    this.addSql('drop table if exists `blog_tag_posts`;');
  }

}
