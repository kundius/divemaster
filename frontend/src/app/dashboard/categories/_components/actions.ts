'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateCategory(alias: string) {
  console.log('revalidating category', `/category/${alias}`)
  // revalidatePath(`/category/${alias}`, 'page')
  revalidatePath('/category/[alias]', 'page')
}
