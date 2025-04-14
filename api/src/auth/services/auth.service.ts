import { UsersService } from '@/users/services/users.service'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FindProfileOrdersDto, SignInDto, SignUpDto, UpdateProfileDto } from '../dto/auth.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/users/entities/user.entity'
import { Role } from '@/users/entities/role.entity'
import { Order } from '@/order/entities/order.entity'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService
  ) {}

  async updateProfile(user: User, dto: UpdateProfileDto) {
    if (!user.name) {
      throw new BadRequestException({
        message: 'Validation failed',
        details: {
          name: 'Имя должно быть заполнено'
        }
      })
    }

    if (user.email != dto.email) {
      if (await this.userRepository.findOneBy({ email: dto.email })) {
        throw new BadRequestException({
          message: 'Validation failed',
          details: {
            email: 'E-mail уже занят'
          }
        })
      }
    }

    if (dto.password) {
      if (dto.password != dto.passwordConfirmation) {
        throw new BadRequestException({
          message: 'Validation failed',
          details: {
            password: 'Пароли не совпадают',
            passwordConfirmation: 'Пароли не совпадают'
          }
        })
      }
      user.password = await this.usersService.generatePasswordHash(dto.password)
    }

    user.email = dto.email
    user.name = dto.name
    user.phone = dto.phone
    user.address = dto.address

    await this.userRepository.save(user)
  }

  async signIn(dto: SignInDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOneBy({ email: dto.email })
    if (!user) {
      throw new BadRequestException('Неправильный e-mail или пароль')
    }
    if (!(await this.usersService.checkPasswordHash(dto.password, user.password))) {
      throw new BadRequestException('Неправильный e-mail или пароль')
    }
    const payload = { sub: user.id, email: user.email }
    return {
      token: await this.jwtService.signAsync(payload)
    }
  }

  async signUp(dto: SignUpDto): Promise<{ token: string }> {
    if (await this.userRepository.findOneBy({ email: dto.email })) {
      throw new BadRequestException('E-mail уже занят')
    }

    if (dto.password !== dto.passwordConfirmation) {
      throw new BadRequestException('Пароли не совпадают')
    }

    const role = await this.roleRepository.findOneOrFail({ where: { title: 'User' } })
    const password = await this.usersService.generatePasswordHash(dto.password)
    const user = this.userRepository.create({
      active: true,
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      role,
      password
    })
    await this.userRepository.save(user)
    const payload = { sub: user.id, email: user.email }
    return {
      token: await this.jwtService.signAsync(payload)
    }
  }

  async findProfileOrders(dto: FindProfileOrdersDto, user: User) {
    const qb = this.orderRepository.createQueryBuilder('order')

    qb.leftJoinAndSelect('order.payment', 'payment')
    qb.leftJoinAndSelect('order.delivery', 'delivery')
    qb.leftJoinAndSelect('order.user', 'user')
    qb.where('user.id = :userId', { userId: user.id })
    qb.orderBy(`order.${dto.sort}`, dto.dir)
    qb.skip(dto.skip)
    qb.take(dto.take)

    const [rows, total] = await qb.getManyAndCount()

    return { rows, total }
  }
}
