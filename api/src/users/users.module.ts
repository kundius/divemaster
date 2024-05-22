import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RolesController } from './controllers/roles.controller'
import { UsersController } from './controllers/users.controller'
import { Role } from './entities/role.entity'
import { User } from './entities/user.entity'
import { RolesService } from './services/roles.service'
import { UsersService } from './services/users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [RolesService, UsersService],
  controllers: [UsersController, RolesController],
  exports: [UsersService, RolesService]
})
export class UsersModule {}
