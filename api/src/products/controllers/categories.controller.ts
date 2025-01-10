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
import { CategoriesService } from '../services/categories.service'
import {
  CreateCategoryDto,
  FindAllCategoryQueryDto,
  FindOneCategoryQueryDto,
  UpdateCategoryDto
} from '../dto/categories.dto'

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

  @Get('alias::alias')
  async findOneByAlias(@Param('alias') alias: string, @Query() dto: FindOneCategoryQueryDto) {
    const category = await this.categoriesService.findOneByAlias(alias, dto)
    if (!category) {
      throw new NotFoundException()
    }
    return category
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() dto: FindOneCategoryQueryDto) {
    return this.categoriesService.findOne(+id, dto)
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
