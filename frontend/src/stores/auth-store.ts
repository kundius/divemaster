import { deleteCookie, setCookie } from 'cookies-next'
import { createStore } from 'zustand/vanilla'

import { apiGet } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { MAX_AGE, TOKEN_NAME } from '@/constants'
import { UserEntity } from '@/types'

export type AuthState = {
  user: UserEntity | null
}

export type AuthActions = {
  hasScope(scopes: string | string[]): boolean
  login(token: string): Promise<void>
  logout(): Promise<void>
  loadUser(): Promise<void>
}

export type AuthStore = AuthState & AuthActions

export const defaultInitState: AuthState = { user: null }

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()((set, get) => ({
    ...initState,

    async loadUser() {
      const data = await apiGet<{ user?: UserEntity }>('auth/profile', {}, withClientAuth())
      set({ user: data.user || null })
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
      setCookie(TOKEN_NAME, token, { path: '/', maxAge: MAX_AGE })
      await get().loadUser()
    },

    async logout() {
      deleteCookie(TOKEN_NAME)
      set({ user: null })
    }
  }))
}
