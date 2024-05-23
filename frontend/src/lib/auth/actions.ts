import { getApiUrl } from '@/lib/utils'
import type { VespUser } from './types'

export async function getUser(token: string): Promise<VespUser | undefined> {
  try {
    const response = await fetch(`${getApiUrl()}auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { user } = (await response.json()) as { user: VespUser | undefined }
    return user
  } catch {
    return undefined
  }
}
