import { User } from '@/users/entities/user.entity'
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query
} from '@nestjs/common'
import { CurrentUser } from '../decorators/current-user.decorator'
import { SignInDto, SignUpDto, UpdateProfileDto } from '../dto/auth.dto'
import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async findProfile(@CurrentUser() user?: User) {
    return { user }
  }

  @Post('profile')
  async updateProfile(@Body() dto: UpdateProfileDto, @CurrentUser() user?: User) {
    if (!user) {
      throw new ForbiddenException()
    }
    await this.authService.updateProfile(user, dto)
    return { user }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }
}
