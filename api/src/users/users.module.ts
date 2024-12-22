import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { RolesController } from './controllers/roles.controller'
import { UsersController } from './controllers/users.controller'
import { Role } from './entities/role.entity'
import { User } from './entities/user.entity'
import { RolesService } from './services/roles.service'
import { UsersService } from './services/users.service'
import { PrismaService } from '@/prisma.service'

@Module({
  imports: [MikroOrmModule.forFeature([User, Role])],
  providers: [RolesService, UsersService, PrismaService],
  controllers: [UsersController, RolesController],
  exports: [UsersService, RolesService]
})
export class UsersModule {}
