import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import {
  CreateOptionDto,
  FindAllOptionCategoriesDto,
  FindAllOptionDto,
  FindOneOptionDto,
  UpdateOptionCategoriesDto,
  UpdateOptionDto
} from '../dto/options.dto'
import { OptionsService } from '../services/options.service'

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  create(@Body() dto: CreateOptionDto) {
    return this.optionsService.create(dto)
  }

  @Get()
  findAll(@Query() query: FindAllOptionDto) {
    return this.optionsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: FindOneOptionDto) {
    return this.optionsService.findOne(+id, query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOptionDto) {
    return this.optionsService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionsService.remove(+id)
  }

  @Get(':optionId/categories')
  findAllCategories(
    @Param('optionId') optionId: string,
    @Query() query: FindAllOptionCategoriesDto
  ) {
    return this.optionsService.findAllCategories(+optionId, query)
  }

  @Patch(':optionId/categories')
  updateCategories(@Param('optionId') optionId: string, @Body() dto: UpdateOptionCategoriesDto) {
    return this.optionsService.updateCategories(+optionId, dto)
  }
}
