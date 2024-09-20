import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'

import { BlogPostCreateDto, BlogPostFindAllDto, BlogPostUpdateDto } from '../dto/blog-post.dto'
import { BlogPostService } from '../services/blog-post.service'

@Controller('blog/post')
export class BlogPostController {
  constructor(private readonly service: BlogPostService) {}

  @Post()
  create(@Body() dto: BlogPostCreateDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query: BlogPostFindAllDto) {
    return this.service.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: BlogPostUpdateDto) {
    return this.service.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
