import { cookies } from 'next/headers'
import { getUser } from './actions'
import { AuthClientProvider } from './client-provider'
import { TOKEN_NAME } from './constants'
import { authPreloadEnabled } from './auth-preload'

export async function AuthServerProvider({ children }: React.PropsWithChildren) {
  let authUser = undefined

  // загружать пользователя только если на странице был вызван `enableAuthPreload`
  if (authPreloadEnabled()) {
    const authToken = cookies().get(TOKEN_NAME)?.value
    if (authToken) {
      authUser = await getUser(authToken)
    }
  }

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

  return (
    <AuthClientProvider initialUser={authUser}>
      {children}
    </AuthClientProvider>
  )
}
