'use server'

import { revalidateTag } from 'next/cache'
import { revalidatePath } from 'next/cache'

export async function revalidateCategory(alias: string) {
  // console.log('revalidating category', `/category/${alias}`)
  // revalidatePath(`/category/${alias}`, 'page')
  console.log('revalidating', alias)
  revalidateTag('category')
}
