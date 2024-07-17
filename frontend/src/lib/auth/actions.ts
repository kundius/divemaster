import { getApiUrl } from '@/lib/utils'
import { UserEntity } from '@/types'

export async function getUser(token: string): Promise<UserEntity | undefined> {
  try {
    const response = await fetch(`${getApiUrl()}auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { user } = (await response.json()) as { user: UserEntity | undefined }
    return user
  } catch {
    return undefined
  }
}
