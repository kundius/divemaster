import { User } from '@/users/entities/user.entity'
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { HasScope, HasScopeMetadata } from '../decorators/has-scope.decorator'

@Injectable()
export class HasScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  checkRequiredScopes(user: User, requiredScopes: string[]) {
    if (!user.role || !user.role.scope) {
      return false
    }

    const check = (scope: string) => {
      if (!user.role.scope) return false
      return user.role.scope.includes(scope)
    }

    return requiredScopes.every(check)
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.get(HasScopeMetadata, context.getHandler())

    if (!requiredScopes) {
      return true
    }

    const { user } = context.switchToHttp().getRequest() as { user?: User }

    if (!user) {
      throw new ForbiddenException('Пользователь не авторизован')
    }

    if (!this.checkRequiredScopes(user, requiredScopes)) {
      throw new ForbiddenException('Недостаточно прав')
    }

    return true
  }
}
