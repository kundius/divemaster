import { UsersService } from '@/users/services/users.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<{ token: string }> {
    const user = await this.usersService.findOneByEmail(email)
    if (!(await this.usersService.checkPasswordHash(pass, user.password))) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.id, email: user.email }
    return {
      token: await this.jwtService.signAsync(payload)
    }
  }
}
