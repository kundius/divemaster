import { EntityManager, EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { BlogPost } from '../entities/blog-post.entity'
import { BlogTag } from '../entities/blog-tag.entity'

@Injectable()
export class BlogService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(BlogPost)
    private blogPostRepository: EntityRepository<BlogPost>,
    @InjectRepository(BlogTag)
    private BlogTagRepository: EntityRepository<BlogTag>,
    private configService: ConfigService
  ) {}
}
