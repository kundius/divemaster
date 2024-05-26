import { getApiUrl } from '@/lib/utils'
import type { User } from './types'

export async function getUser(token: string): Promise<User | undefined> {
  try {
    const response = await fetch(`${getApiUrl()}auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { user } = (await response.json()) as { user: User | undefined }
    return user
  } catch {
    return undefined
  }
}
