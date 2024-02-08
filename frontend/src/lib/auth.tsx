'use client'

import { createContext, useContext, useState } from 'react'

const tokenName = 'auth:token'
const tokenType = 'Bearer'

interface AuthContextType {
  user: VespUser | null
  hasScope: (scopes: string | string[]) => boolean
  setToken: (value?: string) => void
  token?: string
  // getToken: () => string
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  hasScope: () => false,
  setToken: () => {},
  token: undefined
  // getToken: () => ''
  // token, loggedIn, loadUser, login, logout, setToken
})

// async function getData() {
//   const res = await fetch('https://api.example.com/...')
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.

//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error('Failed to fetch data')
//   }

//   return res.json()
// }

export type VespUserRole = {
  id: number
  title: string
  scope: string[]
  [key: string]: any
}

interface VespUser {
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

export function AuthProvider({
  children,
  initialAuthToken
}: React.PropsWithChildren<{ initialAuthToken?: string }>) {
  const [token, _setToken] = useState(initialAuthToken)

  const user = null as VespUser | null

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

  const setToken = (value?: string) => {
    return _setToken(value)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        hasScope,
        setToken,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
