import { StorageModule } from '@/storage/storage.module'
import { Module } from '@nestjs/common'
import { BlogPostController } from './controllers/blog-post.controller'
import { BlogTagController } from './controllers/blog-tag.controller'
import { BlogController } from './controllers/blog.controller'
import { BlogPostService } from './services/blog-post.service'
import { BlogTagService } from './services/blog-tag.service'
import { BlogService } from './services/blog.service'
import { PrismaService } from '@/prisma.service'

@Module({
  imports: [StorageModule],
  providers: [BlogService, BlogPostService, BlogTagService, PrismaService],
  controllers: [BlogController, BlogPostController, BlogTagController],
  exports: [BlogService, BlogPostService, BlogTagService]
})
export class BlogModule {}
