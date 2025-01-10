import { Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'
import { CreateUserDto, FindAllUserQueryDto, UpdateUserDto } from '../dto/users.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsRelations, FindOptionsWhere, In, Like, Repository } from 'typeorm'
import { User } from '../entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create({ roleId, password, ...fillable }: CreateUserDto) {
    const record = new User()

    this.userRepository.merge(record, fillable)

    record.roleId = roleId
    record.password = await this.generatePasswordHash(password)

    await this.userRepository.save(record)

    return record
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ email })
  }

  async findAll(dto: FindAllUserQueryDto) {
    const where: FindOptionsWhere<User> = {}
    const relations: FindOptionsRelations<User> = {}

    relations.role = true

    if (dto.query) {
      where.name = dto.query
    }

    if (dto.roles) {
      where.role = { title: In(dto.roles) }
    }

    const [rows, total] = await this.userRepository.findAndCount({
      where,
      relations,
      order: { [dto.sort]: dto.dir },
      skip: dto.skip,
      take: dto.take
    })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: { role: true, cart: true }
    })
  }

  async update(id: number, { roleId, password, ...fillable }: UpdateUserDto) {
    const record = await this.userRepository.findOneByOrFail({ id })

    this.userRepository.merge(record, fillable)

    if (typeof roleId !== 'undefined') {
      record.roleId = roleId
    }

    if (typeof password !== 'undefined') {
      record.password = await this.generatePasswordHash(password)
    }

    await this.userRepository.save(record)

    return record
  }

  async remove(id: number) {
    await this.userRepository.delete({ id })
  }

  async generatePasswordHash(password: string): Promise<string> {
    return hash(password)
  }

  async checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
      return verify(hash, password)
    } catch (e) {
      return false
    }
  }
}
