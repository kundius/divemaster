import { deleteCookie, setCookie } from 'cookies-next'
import { createStore } from 'zustand/vanilla'

import { apiGet } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { MAX_AGE, TOKEN_NAME } from '@/constants'
import { UserEntity } from '@/types'
import { ApiClient } from '@/lib/api-client'

export type AuthState = {
  user: UserEntity | null
  loginDialogOpened: boolean
  loading: boolean
}

export type AuthActions = {
  hasScope(scopes: string | string[]): boolean
  login(token: string): Promise<void>
  logout(): Promise<void>
  loadUser(): Promise<void>
  setUser(user: UserEntity): void
  loginDialogToggle(value?: boolean): void
}

export const createAuthStore = (initialUser?: UserEntity) =>
  createStore<AuthState & AuthActions>()((set, get) => ({
    user: initialUser || null,
    loginDialogOpened: false,
    loading: false,

    setUser(user) {
      set({ user })
    },

    async loadUser() {
      set({ loading: true })
      const api = new ApiClient()
      await api.withClientAuth()
      const data = await api.get<{ user?: UserEntity }>('auth/profile')
      // const data = await apiGet<{ user?: UserEntity }>('auth/profile', {}, withClientAuth())
      set({ user: data.user || null, loading: false })
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
    },

    loginDialogToggle(loginDialogOpened) {
      if (typeof loginDialogOpened !== 'undefined') {
        set({ loginDialogOpened })
      } else {
        set((prev) => ({ loginDialogOpened: !prev.loginDialogOpened }))
      }
    }
  }))
