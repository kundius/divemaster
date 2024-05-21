import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './controllers/auth.controller'
import { UsersController } from './controllers/users.controller'
import { User } from './entities/user.entity'
import { AuthService } from './services/auth.service'
import { UsersService } from './services/users.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guards/auth.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') }
      })
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    UsersService,
    AuthService
  ],
  controllers: [UsersController, AuthController]
})
export class UsersModule {}
