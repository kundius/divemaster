import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import {
  CreatePropertyDto,
  FindAllPropertyCategoriesDto,
  FindAllPropertyDto,
  FindOnePropertyDto,
  UpdatePropertyCategoriesDto,
  UpdatePropertyDto
} from '../dto/properties.dto'
import { PropertiesService } from '../services/properties.service'

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(dto)
  }

  @Get()
  findAll(@Query() query: FindAllPropertyDto) {
    return this.propertiesService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: FindOnePropertyDto) {
    return this.propertiesService.findOne(+id, query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    return this.propertiesService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id)
  }

  @Get(':propertyId/categories')
  findAllCategories(
    @Param('propertyId') propertyId: string,
    @Query() query: FindAllPropertyCategoriesDto
  ) {
    return this.propertiesService.findAllCategories(+propertyId, query)
  }

  @Patch(':propertyId/categories')
  updateCategories(@Param('propertyId') propertyId: string, @Body() dto: UpdatePropertyCategoriesDto) {
    return this.propertiesService.updateCategories(+propertyId, dto)
  }

  @Get(':propertyId/suggestions')
  suggestions(@Param('propertyId') propertyId: string) {
    return this.propertiesService.suggestions(+propertyId)
  }
}
