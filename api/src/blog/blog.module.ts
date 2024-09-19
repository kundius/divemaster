import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { StorageModule } from '@/storage/storage.module'

import { BlogPost } from './entities/blog-post.entity'
import { BlogTag } from './entities/blog-tag.entity'
import { BlogService } from './services/blog.service'
import { BlogPostService } from './services/blog-post.service'
import { BlogTagService } from './services/blog-tag.service'
import { BlogController } from './controllers/blog.controller'
import { BlogPostController } from './controllers/blog-post.controller'
import { BlogTagController } from './controllers/blog-tag.controller'

@Module({
  imports: [
    MikroOrmModule.forFeature([BlogPost, BlogTag]),
    StorageModule
  ],
  providers: [BlogService, BlogPostService, BlogTagService],
  controllers: [BlogController, BlogPostController, BlogTagController],
  exports: [BlogService, BlogPostService, BlogTagService]
})
export class BlogModule {}
