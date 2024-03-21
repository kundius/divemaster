export type VespUserRole = {
  id: number
  title: string
  scope: string[]
  [key: string]: any
}

export interface VespUser {
  id: number
  username: string
  fullname?: string
  password?: string
  email?: string
  active?: boolean
  role_id?: number
  role?: VespUserRole
  [key: string]: any
}

export interface AuthContextType {
  user?: VespUser
  token?: string
  hasScope: (scopes: string | string[]) => boolean
  logout: () => Promise<void>
  login: (token: string) => Promise<void>
}
