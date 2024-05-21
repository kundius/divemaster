'use client'

import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../utils'
import { getUser } from './actions'
import { MAX_AGE, TOKEN_NAME } from './constants'
import { AuthContext } from './context'
import { AuthContextType, VespUser } from './types'

export function AuthClientProvider({
  children,
  initialToken,
  initialUser
}: React.PropsWithChildren<{ initialToken?: string; initialUser?: VespUser }>) {
  const [token, setToken] = useState(initialToken)
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    if (!(initialToken && initialUser)) {
      initialLoad()
    }
  }, [])

  async function initialLoad() {
    const _token = getCookie(TOKEN_NAME)
    if (_token) {
      const _user = await getUser(_token)
      if (_user) {
        setToken(_token)
        setUser(_user)
      }
    }
  }

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

  // async function deactivateToken(_token: string) {
  //   await fetch(`${getApiUrl()}security/logout`, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${_token}`
  //     }
  //   })
  // }

  async function login(_token: string) {
    const _user = await getUser(_token)

    if (_user) {
      setCookie(TOKEN_NAME, _token, { path: '/', maxAge: MAX_AGE })
      setToken(_token)
      setUser(_user)
    } else {
      // await deactivateToken(_token)
    }
  }

  async function logout() {
    // if (token) {
    //   await deactivateToken(token)
    // }
    deleteCookie(TOKEN_NAME)
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
