import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
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

  @Get('alias::alias')
  async findOneByAlias(@Param('alias') alias: string) {
    const record = await this.service.findOneByAlias(alias)

    if (!record) {
      throw new NotFoundException()
    }

    return record
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Get(':id/neighbors')
  async findNeighbors(@Param('id') id: string) {
    const [previous, next] = await this.service.findNeighbors(+id)
    return { previous, next }
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
