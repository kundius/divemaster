import { getApiUrl } from '@/lib/utils'
import type { VespUser } from './types'

export async function getUser(token: string) {
  const response = await fetch(`${getApiUrl()}auth/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = (await response.json()) as { user: VespUser | undefined }
  const { user } = data
  return user
}
