import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { CreateUserDto, FindAllUserQueryDto, UpdateUserDto } from '../dto/users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ roleId, password, ...fillable }: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: {
        ...fillable,
        role_id: roleId,
        password: await this.generatePasswordHash(password)
      }
    })
    return user
  }

  findOneByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({ where: { email } })
  }

  async findAll(dto: FindAllUserQueryDto) {
    const where: Prisma.UserWhereInput = {}

    if (dto.query) {
      where.OR = [{ name: { contains: dto.query } }, { email: { contains: dto.query } }]
    }

    if (dto.roles) {
      where.role = { title: { in: dto.roles } }
    }

    const rows = await this.prismaService.user.findMany({
      where,
      orderBy: { [dto.sort]: dto.dir },
      take: dto.take,
      skip: dto.skip,
      include: { role: true }
    })
    const total = await this.prismaService.user.count({ where })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id },
      include: { role: true, cart: true }
    })
  }

  async update(id: number, { roleId, password, ...fillable }: UpdateUserDto) {
    const data: Prisma.UserUpdateInput = { ...fillable }

    if (typeof roleId !== 'undefined') {
      data.role = { connect: { id: roleId } }
    }

    if (typeof password !== 'undefined') {
      data.password = await this.generatePasswordHash(password)
    }

    await this.prismaService.user.update({
      where: { id },
      data
    })
  }

  async remove(id: number) {
    await this.prismaService.user.delete({ where: { id } })
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
