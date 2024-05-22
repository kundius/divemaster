import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRoleDto } from '../dto/create-role.dto'
import { FindAllRoleQueryDto } from '../dto/find-all-role-query.dto'
import { UpdateRoleDto } from '../dto/update-role.dto'
import { Role } from '../entities/role.entity'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  async findAll(query: FindAllRoleQueryDto) {
    const [rows, total] = await this.rolesRepository.findAndCount(query.options)
    return { rows, total }
  }

  findOne(id: number) {
    return this.rolesRepository.findOneByOrFail({ id })
  }

  async create(createRoleDto: CreateRoleDto) {
    return await this.rolesRepository.save(
      this.rolesRepository.create({
        title: createRoleDto.title,
        scope: createRoleDto.scope
      })
    )
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.rolesRepository.update(id, {
      title: updateRoleDto.title,
      scope: updateRoleDto.scope
    })
  }

  async remove(id: number) {
    await this.rolesRepository.delete(id)
  }
}
