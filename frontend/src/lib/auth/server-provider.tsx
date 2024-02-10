import { cookies } from 'next/headers'
import { getUser } from './actions'
import { AuthClientProvider } from './client-provider'
import { TOKEN_NAME } from './constants'

export async function AuthServerProvider({ children }: React.PropsWithChildren) {
  const authToken = cookies().get(TOKEN_NAME)?.value
  const authUser = authToken ? await getUser(authToken) : undefined

  return (
    <AuthClientProvider initialToken={authToken} initialUser={authUser}>
      {children}
    </AuthClientProvider>
  )
}
