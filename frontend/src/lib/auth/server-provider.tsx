import { cookies } from 'next/headers'
import { getUser } from './actions'
import { AuthClientProvider } from './client-provider'
import { TOKEN_NAME } from './constants'

export async function AuthServerProvider({ children }: React.PropsWithChildren) {
  let authToken = undefined
  let authUser = undefined

  // Не загружать пользователя во время сборки, чтобы сохранить статическую генерацию.
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    authToken = cookies().get(TOKEN_NAME)?.value
    authUser = authToken ? await getUser(authToken) : undefined
  }

  return (
    <AuthClientProvider initialToken={authToken} initialUser={authUser}>
      {children}
    </AuthClientProvider>
  )
}
