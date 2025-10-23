import { Reflector } from '@nestjs/core'

export const HasScopeMetadata = Reflector.createDecorator<string[]>()

export const HasScope = (...scopes: string[]) => HasScopeMetadata(scopes)
