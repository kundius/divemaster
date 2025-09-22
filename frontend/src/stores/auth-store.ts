import { createStore } from 'zustand/vanilla'
import { UserEntity } from '@/types'
import { apiGet, apiPost } from '@/lib/api'
import { deleteCookie, setCookie } from 'cookies-next'

export type AuthState = {
  user: UserEntity | null
  loginDialogOpened: boolean
}

export type AuthActions = {
  hasScope(scopes: string | string[]): boolean
  login(token: string): Promise<void>
  logout(): Promise<void>
  loadUser(): Promise<void>
  setUser(user: UserEntity | null): void
  loginDialogToggle(value?: boolean): void
}

export const createAuthStore = () =>
  createStore<AuthState & AuthActions>()((set, get) => ({
    user: null,
    loginDialogOpened: false,

    setUser(user) {
      set({ user })
    },

    async loadUser() {
      const { user = null } = await apiGet<{ user?: UserEntity }>('auth/profile')
      get().setUser(user)
    },

    hasScope(scopes) {
      const user = get().user

      if (!user || !user.role || !user.role.scope) {
        return false
      }
      const { role } = user

      const check = (scope: string) => {
        if (!role.scope) return false
        if (scope.includes('/')) {
          return role.scope.includes(scope) || role.scope.includes(scope.replace(/\/.*/, ''))
        }
        return role.scope.includes(scope) || role.scope.includes(`${scope}/get`)
      }

      if (Array.isArray(scopes)) {
        for (const scope of scopes) {
          if (check(scope)) {
            return true
          }
        }
        return false
      }

      return check(scopes)
    },

    async login(token) {
      setCookie(String(process.env.NEXT_PUBLIC_JWT_TOKEN_NAME), token, {
        path: '/',
        maxAge: Number(process.env.NEXT_PUBLIC_JWT_EXPIRE)
      })
      await get().loadUser()
    },

    async logout() {
      deleteCookie(String(process.env.NEXT_PUBLIC_JWT_TOKEN_NAME))
      get().setUser(null)
    },

    loginDialogToggle(loginDialogOpened) {
      if (typeof loginDialogOpened !== 'undefined') {
        set({ loginDialogOpened })
      } else {
        set((prev) => ({ loginDialogOpened: !prev.loginDialogOpened }))
      }
    }
  }))
