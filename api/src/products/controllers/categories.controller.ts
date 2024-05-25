import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { FindAllCategoryQueryDto } from '../dto/find-all-category-query.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { CategoriesService } from '../services/categories.service'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { GetTreeCategoryQueryDto } from '../dto/get-tree-category-query.dto'

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id)
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
