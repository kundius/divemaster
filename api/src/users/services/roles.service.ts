import { Injectable } from '@nestjs/common'
import { CreateRoleDto, FindAllRoleQueryDto, UpdateRoleDto } from '../dto/roles.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Role } from '../entities/role.entity'
import { ArrayContains, FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async create(fillable: CreateRoleDto): Promise<Role> {
    const record = new Role()

    this.roleRepository.merge(record, fillable)

    await this.roleRepository.save(record)

    return record
  }

  async findAll(dto: FindAllRoleQueryDto) {
    const where: FindOptionsWhere<Role> = {}
    const relations: FindOptionsRelations<Role> = {}

    if (dto.query) {
      where.title = Like(dto.query)
    }

    if (dto.scope) {
      where.scope = ArrayContains(dto.scope)
    }

    const [rows, total] = await this.roleRepository.findAndCount({
      where,
      relations,
      order: { [dto.sort]: dto.dir },
      skip: dto.skip,
      take: dto.take
    })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.roleRepository.findOneByOrFail({ id })
  }

  async update(id: number, fillable: UpdateRoleDto) {
    const record = await this.roleRepository.findOneByOrFail({ id })

    this.roleRepository.merge(record, fillable)

    await this.roleRepository.save(record)

    return record
  }

  async remove(id: number) {
    await this.roleRepository.delete({ id })
  }
}
