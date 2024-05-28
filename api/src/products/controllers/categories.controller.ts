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
import { CreateCategoryDto } from '../dto/create-category.dto'
import { FindAllCategoryQueryDto } from '../dto/find-all-category-query.dto'
import { GetTreeCategoryQueryDto } from '../dto/get-tree-category-query.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { CategoriesService } from '../services/categories.service'
import { FindOneCategoryQueryDto } from '../dto/find-one-category-query.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto)
  }

  @Get()
  findAll(@Query() query: FindAllCategoryQueryDto) {
    return this.categoriesService.findAll(query)
  }

  @Get('tree')
  getTree(@Query() query: GetTreeCategoryQueryDto) {
    return this.categoriesService.getTree(query)
  }

  @Get('alias::alias')
  async findOneByAlias(@Param('alias') alias: string, @Query() query: FindOneCategoryQueryDto) {
    const category = await this.categoriesService.findOneByAlias(alias, query)
    if (!category) {
      throw new NotFoundException()
    }
    return category
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: FindOneCategoryQueryDto) {
    return this.categoriesService.findOne(+id, query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id)
  }
}
