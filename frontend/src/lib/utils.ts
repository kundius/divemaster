import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(): string {
  const SITE_URL = String(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost')
  const API_URL = String(process.env.NEXT_PUBLIC_API_URL || 'api')

  const url = /:\/\//.test(API_URL)
    ? API_URL
    : [
        SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL,
        API_URL.startsWith('/') ? API_URL.substring(1) : API_URL
      ].join('/')
  return url.endsWith('/') ? url : url + '/'
}

// export function hasScope(scopes: string | string[]): boolean {
//   const {user: data} = useAuth()
//   const user: VespUser = {id: 0, username: '', ...data.value}
//   if (!user || !user.role || !user.role.scope) {
//     return false
//   }
//   const {role} = user

//   const check = (scope: string) => {
//     if (scope.includes('/')) {
//       return role.scope.includes(scope) || role.scope.includes(scope.replace(/\/.*/, ''))
//     }
//     return role.scope.includes(scope) || role.scope.includes(`${scope}/get`)
//   }

//   if (Array.isArray(scopes)) {
//     for (const scope of scopes) {
//       if (check(scope)) {
//         return true
//       }
//     }
//     return false
//   }

//   return check(scopes)
// }
