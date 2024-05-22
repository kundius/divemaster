import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CreateRoleDto } from '../dto/create-role.dto'
import { UpdateRoleDto } from '../dto/update-role.dto'
import { RolesService } from '../services/roles.service'
import { FindAllRoleQueryDto } from '../dto/find-all-role-query.dto'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get()
  findAll(@Query() query: FindAllRoleQueryDto) {
    return this.rolesService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id)
  }
}
