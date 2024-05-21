import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from './users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<{ token: string }> {
    const user = await this.usersService.findOneByEmail(email)
    if (user?.password !== pass) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.id, email: user.email }
    return {
      token: await this.jwtService.signAsync(payload)
    }
  }
}
