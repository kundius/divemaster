import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'

import { BlogTagCreateDto, BlogTagFindAllDto, BlogTagUpdateDto } from '../dto/blog-tag.dto'
import { BlogTagService } from '../services/blog-tag.service'

@Controller('blog/tag')
export class BlogTagController {
  constructor(private readonly service: BlogTagService) {}

  @Post()
  create(@Body() dto: BlogTagCreateDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query: BlogTagFindAllDto) {
    return this.service.findAll(query)
  }

  @Get('alias::alias')
  findOneByAlias(@Param('alias') alias: string) {
    return this.service.findOneByAlias(alias)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: BlogTagUpdateDto) {
    return this.service.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
