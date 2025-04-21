'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateCategory(alias: string) {
  console.log('revalidating category', `/category/${alias}`)
  revalidatePath(`/(site)/category/${alias}`, 'page')
}
