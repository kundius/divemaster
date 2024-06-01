import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CreateBrandDto } from '../dto/create-brand.dto'
import { FindAllBrandQueryDto } from '../dto/find-all-brand-query.dto'
import { FindOneBrandQueryDto } from '../dto/find-one-brand-query.dto'
import { UpdateBrandDto } from '../dto/update-brand.dto'
import { BrandsService } from '../services/brands.service'

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto)
  }

  @Get()
  findAll(@Query() query: FindAllBrandQueryDto) {
    return this.brandsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: FindOneBrandQueryDto) {
    return this.brandsService.findOne(+id, query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id)
  }
}
