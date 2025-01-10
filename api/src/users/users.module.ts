import { Module } from '@nestjs/common'
import { RolesController } from './controllers/roles.controller'
import { UsersController } from './controllers/users.controller'
import { RolesService } from './services/roles.service'
import { UsersService } from './services/users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Role } from './entities/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [RolesService, UsersService],
  controllers: [UsersController, RolesController],
  exports: [UsersService, RolesService]
})
export class UsersModule {}
