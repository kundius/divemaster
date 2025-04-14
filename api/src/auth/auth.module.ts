import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './controllers/auth.controller'
import { AuthGuard } from './guards/auth.guard'
import { AuthService } from './services/auth.service'
import { UsersModule } from '@/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/users/entities/user.entity'
import { Role } from '@/users/entities/role.entity'
import { Order } from '@/order/entities/order.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Order]),
    UsersModule,
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
    AuthService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
