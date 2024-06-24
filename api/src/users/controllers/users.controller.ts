import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { UsersService } from '../services/users.service'
import { CreateUserDto, FindAllUserQueryDto, UpdateUserDto } from '../dto/users.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @Get()
  findAll(@Query() dto: FindAllUserQueryDto) {
    return this.usersService.findAll(dto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
