import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import {
  CreateOptionDto,
  FindAllOptionQueryDto,
  FindOneOptionQueryDto,
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
  findAll(@Query() query: FindAllOptionQueryDto) {
    return this.optionsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: FindOneOptionQueryDto) {
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
}
