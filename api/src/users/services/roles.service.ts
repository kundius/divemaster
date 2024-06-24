import { Injectable } from '@nestjs/common'
import { Role } from '../entities/role.entity'
import { EntityRepository, FilterQuery, ObjectQuery, raw } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateRoleDto, FindAllRoleQueryDto, UpdateRoleDto } from '../dto/roles.dto'

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

  async findAll(dto: FindAllRoleQueryDto) {
    let where: ObjectQuery<Role> = {}
    if (dto.query) {
      where = {
        ...where,
        title: {
          $like: '%' + dto.query + '%'
        }
      }
    }
    if (dto.scope) {
      where = {
        ...where,
        [raw(`JSON_CONTAINS(scope, '${JSON.stringify(dto.scope)}', '$')`)]: 1
      }
    }
    const rows = await this.rolesRepository.find(where, {
      limit: dto.take,
      offset: dto.skip,
      orderBy: { [dto.sort]: dto.dir }
    })
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
