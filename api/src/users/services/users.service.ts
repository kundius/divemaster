import { Injectable } from '@nestjs/common'
import { verify, hash } from 'argon2'
import { User } from '../entities/user.entity'
import { RolesService } from './roles.service'
import { EntityRepository, FilterQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateUserDto, FindAllUserQueryDto, UpdateUserDto } from '../dto/users.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
    private rolesService: RolesService
  ) {}

  async create({ roleId, password, ...fillable }: CreateUserDto) {
    const user = new User()

    this.usersRepository.assign(user, fillable)

    user.password = await this.generatePasswordHash(password)
    user.role = await this.rolesService.findOne(roleId)

    await this.usersRepository.getEntityManager().persistAndFlush(user)

    return user
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ email })
  }

  async findAll(dto: FindAllUserQueryDto) {
    let where: FilterQuery<User> = {}

    if (dto.query) {
      where = {
        ...where,
        name: {
          $like: '%' + dto.query + '%'
        }
      }
    }

    const [rows, total] = await this.usersRepository.findAndCount(where, {
      limit: dto.take,
      offset: dto.skip,
      orderBy: { [dto.sort]: dto.dir },
      populate: ['role']
    })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.usersRepository.findOneOrFail({ id }, { populate: ['role'] })
  }

  async update(id: number, { roleId, password, ...fillable }: UpdateUserDto) {
    const user = await this.findOne(id)

    this.usersRepository.assign(user, fillable)

    if (typeof roleId !== 'undefined') {
      user.role = await this.rolesService.findOne(roleId)
    }
    if (typeof password !== 'undefined') {
      user.password = await this.generatePasswordHash(password)
    }

    await this.usersRepository.getEntityManager().persistAndFlush(user)
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneOrFail({ id })
    await this.usersRepository.getEntityManager().remove(user).flush()
  }

  async generatePasswordHash(password: string): Promise<string> {
    return await hash(password)
  }

  async checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
      return await verify(hash, password)
    } catch (e) {
      return false
    }
  }
}
