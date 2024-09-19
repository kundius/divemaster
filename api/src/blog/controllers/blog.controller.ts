import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common'
import { BlogService } from '../services/blog.service'

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
}
