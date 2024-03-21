import { getApiUrl } from '@/lib/utils'
import type { VespUser } from './types'

export async function getUser(token: string) {
  const response = await fetch(`${getApiUrl()}user/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const { user } = (await response.json()) as { user: VespUser | undefined }
  return user
}
