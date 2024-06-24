import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { BrandsService } from '../services/brands.service'
import { CreateBrandDto, FindAllBrandQueryDto, UpdateBrandDto } from '../dto/brands.dto'

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
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id)
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
