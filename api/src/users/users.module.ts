import { Module } from '@nestjs/common'
import { RolesController } from './controllers/roles.controller'
import { UsersController } from './controllers/users.controller'
import { RolesService } from './services/roles.service'
import { UsersService } from './services/users.service'
import { PrismaService } from '@/prisma.service'

@Module({
  providers: [RolesService, UsersService, PrismaService],
  controllers: [UsersController, RolesController],
  exports: [UsersService, RolesService]
})
export class UsersModule {}
