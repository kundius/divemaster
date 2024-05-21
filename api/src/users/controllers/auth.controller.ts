import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { User } from '../entities/user.entity'
import { CurrentUser } from '../decorators/current-user.decorator'
import { AuthService } from '../services/auth.service'
import { UsersService } from '../services/users.service'

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
