import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CreateUserDto } from '../dto/create-user.dto'
import { FindAllUserQueryDto } from '../dto/find-all-user-query.dto'
import { RolesService } from './roles.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService
  ) {}

  async create({ role_id, ...fillable }: CreateUserDto) {
    const user = new User()

    this.usersRepository.merge(user, fillable)

    user.role = await this.rolesService.findOne(role_id)

    await this.usersRepository.save(user)

    return user
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({ email })
  }

  async findAll(query: FindAllUserQueryDto) {
    const [rows, total] = await this.usersRepository.findAndCount(query.options)
    return { rows, total }
  }

  async findOne(id: number) {
    return this.usersRepository.findOneByOrFail({ id })
  }

  async update(id: number, { role_id, ...fillable }: UpdateUserDto) {
    const user = await this.findOne(id)

    this.usersRepository.merge(user, fillable)

    if (typeof role_id !== 'undefined') {
      user.role = await this.rolesService.findOne(role_id)
    }

    await this.usersRepository.save(user)
  }

  async remove(id: number) {
    await this.usersRepository.delete(id)
  }
}
