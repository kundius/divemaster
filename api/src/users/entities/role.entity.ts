import { Role as RoleType } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export class Role implements RoleType {
  id: number
  title: string
  scope: JsonValue | null
}
