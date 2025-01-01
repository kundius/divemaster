import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma, Role } from '@prisma/client'
import { CreateRoleDto, FindAllRoleQueryDto, UpdateRoleDto } from '../dto/roles.dto'

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = await this.prismaService.role.create({
      data: {
        title: dto.title,
        scope: dto.scope
      }
    })
    return role
  }

  async findAll(dto: FindAllRoleQueryDto) {
    const where: Prisma.RoleWhereInput = {}

    if (dto.query) {
      where.title = { contains: dto.query }
    }

    if (dto.scope) {
      where.scope = {
        array_contains: dto.scope
      }
    }

    const rows = await this.prismaService.role.findMany({
      where,
      take: dto.take,
      skip: dto.skip,
      orderBy: { [dto.sort]: dto.dir }
    })
    const total = await this.prismaService.role.count({ where })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.prismaService.role.findUniqueOrThrow({ where: { id } })
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.prismaService.role.update({
      where: { id },
      data: updateRoleDto
    })
    return role
  }

  async remove(id: number) {
    await this.prismaService.role.delete({ where: { id } })
  }
}
