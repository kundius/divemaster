import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from '../dto/create-role.dto'
import { FindAllRoleQueryDto } from '../dto/find-all-role-query.dto'
import { UpdateRoleDto } from '../dto/update-role.dto'
import { Role } from '../entities/role.entity'
import { EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: EntityRepository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role()
    role.title = createRoleDto.title
    role.scope = createRoleDto.scope
    await this.rolesRepository.getEntityManager().persistAndFlush(role)
    return role
  }

  async findAll(query: FindAllRoleQueryDto) {
    const rows = await this.rolesRepository.find(query.where, query.options)
    return { rows, total: 0 }
  }

  async findOne(id: number) {
    return await this.rolesRepository.findOneOrFail({ id })
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesRepository.findOneOrFail({ id })
    this.rolesRepository.assign(role, updateRoleDto)
    await this.rolesRepository.getEntityManager().persistAndFlush(role)
  }

  async remove(id: number) {
    const role = await this.rolesRepository.findOneOrFail({ id })
    await this.rolesRepository.getEntityManager().remove(role).flush()
  }
}
