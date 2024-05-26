export type UserRole = {
  id: number
  title: string
  scope: string[]
}

export interface User {
  id: number
  name: string
  email: string
  active: boolean
  role: UserRole
}

export interface AuthContextType {
  user?: User
  hasScope: (scopes: string | string[]) => boolean
  logout: () => Promise<void>
  login: (token: string) => Promise<void>
}
