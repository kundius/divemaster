'use client'

import { setCookie } from 'cookies-next'
import { createContext, useContext, useState } from 'react'
import { getApiUrl } from '../utils'
import { tokenName } from './constants'
import { getUser } from './actions'
import { VespUser } from './types'

interface AuthContextType {
  user?: VespUser
  token?: string
  hasScope: (scopes: string | string[]) => boolean
  logout: () => Promise<void>
  login: (token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({
  children,
  initialToken,
  initialUser
}: React.PropsWithChildren<{ initialToken?: string; initialUser?: VespUser }>) {
  const [token, setToken] = useState(initialToken)
  const [user, setUser] = useState(initialUser)

  // useEffect(() => {
  //   async function load() {
  //     if (!token) {
  //       const cookieToken = getCookie(tokenName)
  //       if (cookieToken) {
  //         setToken(cookieToken)
  //         setUser(await getUser(cookieToken))
  //       }
  //     }
  //   }
  //   load()
  // }, [])

  const hasScope: AuthContextType['hasScope'] = (scopes) => {
    if (!user || !user.role || !user.role.scope) {
      return false
    }
    const { role } = user

    const check = (scope: string) => {
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
    setToken(token)
    const maxAge = Number(process.env.NEXT_PUBLIC_JWT_EXPIRE)
    setCookie(tokenName, token, { path: '/', maxAge })
    setUser(await getUser(token))
  }

  async function logout() {
    if (token) {
      await fetch(`${getApiUrl()}security/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    setToken(undefined)
    setUser(undefined)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        hasScope,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
