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

  findOne(id: number): Promise<Role | null> {
    return this.rolesRepository.findOneBy({ id })
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.rolesRepository.save(
      this.rolesRepository.create({
        title: createRoleDto.title,
        scope: createRoleDto.scope
      })
    )
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<void> {
    const res = await this.rolesRepository.update(id, {
      title: updateRoleDto.title,
      scope: updateRoleDto.scope
    })
    console.log(res)
  }

  async remove(id: number): Promise<void> {
    await this.rolesRepository.delete(id)
  }
}
