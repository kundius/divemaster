import { UsersService } from '@/users/services/users.service'
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CurrentUser } from '../decorators/current-user.decorator'
import { AuthService } from '../services/auth.service'
import { User } from '@/users/entities/user.entity'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user?: User) {
    return { user }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }
}
