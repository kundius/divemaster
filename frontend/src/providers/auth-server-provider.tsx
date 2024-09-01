'use server'

import { cache } from 'react'

import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import type { UserEntity } from '@/types'
import { AuthStoreProvider } from './auth-store-provider'
import { LoginDialog } from '@/components/LoginDialog'

const preloadEnabled = cache<() => { current: boolean }>(() => ({ current: false }))

export const authPreloadEnabled = () => {
  return preloadEnabled().current
}

export const enableAuthPreload = () => {
  preloadEnabled().current = true
}

export async function AuthServerProvider({ children }: React.PropsWithChildren) {
  let authUser: UserEntity | undefined = undefined

  // загружать пользователя только если на странице был вызван `enableAuthPreload`
  // console.log(authPreloadEnabled())
  // if (authPreloadEnabled()) {
  //   const data = await apiGet<{ user?: UserEntity }>('auth/profile', {}, withServerAuth())
  //   authUser = data.user
  // }

  // let authToken = undefined
  // let authUser = undefined

  // Из кэша получаем список кэшируемых роутов и текущую страницу
  // const { __incrementalCache } = globalThis as typeof globalThis & {
  //   __incrementalCache: IncrementalCache
  // }
  // const invokeOutput = __incrementalCache.requestHeaders['x-invoke-output']
  // const { routes, dynamicRoutes } = __incrementalCache.prerenderManifest
  // // console.log(__incrementalCache)

  // // Загружаем пользователя только если текущая страница не кэшируется
  // if (typeof invokeOutput === 'string' && !routes[invokeOutput] && !dynamicRoutes[invokeOutput]) {
  //   authToken = cookies().get(TOKEN_NAME)?.value
  //   authUser = authToken ? await getUser(authToken) : undefined
  // }

  return <AuthStoreProvider initialUser={authUser}>{children}</AuthStoreProvider>
}
