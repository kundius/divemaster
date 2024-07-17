'use client'

import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

import { getUser } from './actions'
import { MAX_AGE, TOKEN_NAME } from './constants'
import { AuthContext } from './context'
import { UserEntity } from '@/types'

export interface AuthContextType {
  user?: UserEntity
  hasScope: (scopes: string | string[]) => boolean
  logout: () => Promise<void>
  login: (token: string) => Promise<void>
}

export function AuthClientProvider({
  children,
  initialUser
}: React.PropsWithChildren<{ initialToken?: string; initialUser?: UserEntity }>) {
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    initialLoad()
  }, [])

  async function initialLoad() {
    if (!!initialUser) return

    const token = getCookie(TOKEN_NAME)

    if (token) {
      setUser(await getUser(token))
    }
  }

  const hasScope: AuthContextType['hasScope'] = (scopes) => {
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
  }

  async function login(token: string) {
    const user = await getUser(token)

    if (user) {
      setCookie(TOKEN_NAME, token, { path: '/', maxAge: MAX_AGE })
      setUser(user)
    }
  }

  async function logout() {
    deleteCookie(TOKEN_NAME)
    setUser(undefined)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        hasScope,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
